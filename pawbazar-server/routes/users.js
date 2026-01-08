import express from "express";
import { connectDB } from "../config/database.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

// Get user profile
router.get("/profile", authenticateUser, async (req, res) => {
  try {
    const { db } = await connectDB();
    const { email } = req.user;

    // Get user's basic info and stats
    const [userListings, userOrders, userStats] = await Promise.all([
      db.collection("listings").countDocuments({ email }),
      db.collection("orders").countDocuments({ email }),
      db
        .collection("listings")
        .aggregate([
          { $match: { email } },
          {
            $group: {
              _id: null,
              totalViews: { $sum: { $ifNull: ["$views", 0] } },
              categories: { $addToSet: "$category" },
            },
          },
        ])
        .toArray(),
    ]);

    const stats = userStats[0] || { totalViews: 0, categories: [] };

    res.json({
      success: true,
      data: {
        email,
        displayName: req.user.name || req.user.displayName,
        photoURL: req.user.picture || req.user.photoURL,
        stats: {
          totalListings: userListings,
          totalOrders: userOrders,
          totalViews: stats.totalViews,
          categoriesUsed: stats.categories.length,
        },
        joinedAt: req.user.iat ? new Date(req.user.iat * 1000) : null,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
      error: error.message,
    });
  }
});

// Update user preferences
router.put("/preferences", authenticateUser, async (req, res) => {
  try {
    const { db } = await connectDB();
    const { email } = req.user;
    const preferences = req.body;

    // Validate preferences structure
    const allowedPreferences = [
      "notifications",
      "privacy",
      "display",
      "location",
    ];

    const validPreferences = {};
    for (const [key, value] of Object.entries(preferences)) {
      if (allowedPreferences.some((allowed) => key.startsWith(allowed))) {
        validPreferences[key] = value;
      }
    }

    const result = await db.collection("userPreferences").updateOne(
      { email },
      {
        $set: {
          ...validPreferences,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          email,
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    res.json({
      success: true,
      message: "Preferences updated successfully",
      data: validPreferences,
    });
  } catch (error) {
    console.error("Error updating user preferences:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update preferences",
      error: error.message,
    });
  }
});

// Get user preferences
router.get("/preferences", authenticateUser, async (req, res) => {
  try {
    const { db } = await connectDB();
    const { email } = req.user;

    const preferences = await db
      .collection("userPreferences")
      .findOne({ email });

    res.json({
      success: true,
      data: preferences || {},
    });
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch preferences",
      error: error.message,
    });
  }
});

// Get user activity feed
router.get("/activity", authenticateUser, async (req, res) => {
  try {
    const { db } = await connectDB();
    const { email } = req.user;
    const { limit = 20, page = 1 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get recent user activities
    const activities = [];

    // Recent listings
    const recentListings = await db
      .collection("listings")
      .find({ email })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    recentListings.forEach((listing) => {
      activities.push({
        type: "listing_created",
        title: "Created a new listing",
        description: `Listed "${listing.name}" for ${
          listing.price === 0 ? "adoption" : "৳" + listing.price
        }`,
        timestamp: listing.createdAt || listing.date,
        data: { listingId: listing._id, listingName: listing.name },
      });
    });

    // Recent orders
    const recentOrders = await db
      .collection("orders")
      .find({ email })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    recentOrders.forEach((order) => {
      activities.push({
        type: "order_placed",
        title: "Placed an order",
        description: `Ordered "${order.productName}"`,
        timestamp: order.createdAt || order.date,
        data: { orderId: order._id, productName: order.productName },
      });
    });

    // Sort activities by timestamp
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Apply pagination
    const paginatedActivities = activities.slice(skip, skip + parseInt(limit));

    res.json({
      success: true,
      data: paginatedActivities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: activities.length,
        pages: Math.ceil(activities.length / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching user activity:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user activity",
      error: error.message,
    });
  }
});

// Get user's saved/favorite listings
router.get("/favorites", authenticateUser, async (req, res) => {
  try {
    const { db } = await connectDB();
    const { email } = req.user;

    const favorites = await db
      .collection("userFavorites")
      .find({ email })
      .toArray();

    const listingIds = favorites.map((fav) => fav.listingId);

    const listings = await db
      .collection("listings")
      .find({ _id: { $in: listingIds } })
      .toArray();

    res.json({
      success: true,
      data: listings,
      count: listings.length,
    });
  } catch (error) {
    console.error("Error fetching user favorites:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch favorites",
      error: error.message,
    });
  }
});

// Add listing to favorites
router.post("/favorites/:listingId", authenticateUser, async (req, res) => {
  try {
    const { db } = await connectDB();
    const { email } = req.user;
    const { listingId } = req.params;

    // Check if listing exists
    const listing = await db.collection("listings").findOne({ _id: listingId });
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    // Add to favorites (upsert to avoid duplicates)
    await db.collection("userFavorites").updateOne(
      { email, listingId },
      {
        $set: {
          email,
          listingId,
          listingName: listing.name,
          addedAt: new Date(),
        },
      },
      { upsert: true }
    );

    res.json({
      success: true,
      message: "Added to favorites",
    });
  } catch (error) {
    console.error("Error adding to favorites:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add to favorites",
      error: error.message,
    });
  }
});

// Remove listing from favorites
router.delete("/favorites/:listingId", authenticateUser, async (req, res) => {
  try {
    const { db } = await connectDB();
    const { email } = req.user;
    const { listingId } = req.params;

    const result = await db.collection("userFavorites").deleteOne({
      email,
      listingId,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Favorite not found",
      });
    }

    res.json({
      success: true,
      message: "Removed from favorites",
    });
  } catch (error) {
    console.error("Error removing from favorites:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove from favorites",
      error: error.message,
    });
  }
});

// Get user notifications
router.get("/notifications", authenticateUser, async (req, res) => {
  try {
    const { db } = await connectDB();
    const { email } = req.user;
    const { limit = 20, unreadOnly = false } = req.query;

    const query = { email };
    if (unreadOnly === "true") {
      query.read = false;
    }

    const notifications = await db
      .collection("userNotifications")
      .find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .toArray();

    const unreadCount = await db
      .collection("userNotifications")
      .countDocuments({ email, read: false });

    res.json({
      success: true,
      data: notifications,
      unreadCount,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
});

// Mark notification as read
router.patch(
  "/notifications/:notificationId/read",
  authenticateUser,
  async (req, res) => {
    try {
      const { db } = await connectDB();
      const { email } = req.user;
      const { notificationId } = req.params;

      const result = await db
        .collection("userNotifications")
        .updateOne(
          { _id: notificationId, email },
          { $set: { read: true, readAt: new Date() } }
        );

      if (result.matchedCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Notification not found",
        });
      }

      res.json({
        success: true,
        message: "Notification marked as read",
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({
        success: false,
        message: "Failed to mark notification as read",
        error: error.message,
      });
    }
  }
);

export default router;

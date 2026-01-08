import express from "express";
import { ObjectId } from "mongodb";
import { connectDB } from "../config/database.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

// Admin middleware - check if user is admin
const requireAdmin = (req, res, next) => {
  const { email } = req.user;

  // Define admin emails (in production, this should be in database or env)
  const adminEmails = [
    "mdjfardous@gmail.com",
    "admin@pawbazar.com",
    "demo@gmail.com", // For demo mode
  ];

  if (!adminEmails.includes(email)) {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  next();
};

// Get admin dashboard statistics
router.get("/dashboard", authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { db } = await connectDB();

    // Get various statistics
    const [
      totalListings,
      totalOrders,
      totalUsers,
      totalFavorites,
      totalReviews,
      totalMessages,
      recentListings,
      recentOrders,
      categoryStats,
      locationStats,
    ] = await Promise.all([
      db.collection("listings").countDocuments(),
      db.collection("orders").countDocuments(),
      db
        .collection("listings")
        .distinct("email")
        .then((emails) => emails.length),
      db.collection("favorites").countDocuments(),
      db.collection("reviews").countDocuments(),
      db.collection("messages").countDocuments(),
      db
        .collection("listings")
        .find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray(),
      db
        .collection("orders")
        .find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray(),
      db
        .collection("listings")
        .aggregate([
          { $group: { _id: "$category", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ])
        .toArray(),
      db
        .collection("listings")
        .aggregate([
          { $group: { _id: "$location", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ])
        .toArray(),
    ]);

    // Calculate growth metrics (mock data for demo)
    const stats = {
      overview: {
        totalListings,
        totalOrders,
        totalUsers,
        totalFavorites,
        totalReviews,
        totalMessages,
      },
      growth: {
        listingsGrowth: 12.5, // Mock percentage
        ordersGrowth: 8.3,
        usersGrowth: 15.7,
        revenueGrowth: 22.1,
      },
      recent: {
        listings: recentListings,
        orders: recentOrders,
      },
      analytics: {
        categories: categoryStats,
        locations: locationStats,
      },
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching admin dashboard:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin dashboard",
      error: error.message,
    });
  }
});

// Get all users
router.get("/users", authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { db } = await connectDB();
    const { page = 1, limit = 20, search = "" } = req.query;

    // Get unique users from listings
    const pipeline = [
      {
        $group: {
          _id: "$email",
          name: { $first: "$email" },
          listingsCount: { $sum: 1 },
          lastActivity: { $max: "$createdAt" },
          firstListing: { $min: "$createdAt" },
        },
      },
      {
        $sort: { lastActivity: -1 },
      },
    ];

    if (search) {
      pipeline.unshift({
        $match: {
          email: { $regex: search, $options: "i" },
        },
      });
    }

    const users = await db.collection("listings").aggregate(pipeline).toArray();

    // Add order counts
    for (const user of users) {
      const orderCount = await db.collection("orders").countDocuments({
        email: user._id,
      });
      user.ordersCount = orderCount;
    }

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedUsers = users.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedUsers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: users.length,
        pages: Math.ceil(users.length / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
});

// Manage listings (approve, reject, delete)
router.patch(
  "/listings/:id/status",
  authenticateUser,
  requireAdmin,
  async (req, res) => {
    try {
      const { db } = await connectDB();
      const { id } = req.params;
      const { status, reason } = req.body;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid listing ID",
        });
      }

      const validStatuses = ["active", "pending", "rejected", "suspended"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status",
        });
      }

      const updateData = {
        status,
        moderatedAt: new Date(),
        moderatedBy: req.user.email,
      };

      if (reason) {
        updateData.moderationReason = reason;
      }

      const result = await db
        .collection("listings")
        .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

      if (result.matchedCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Listing not found",
        });
      }

      res.json({
        success: true,
        message: `Listing ${status} successfully`,
      });
    } catch (error) {
      console.error("Error updating listing status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update listing status",
        error: error.message,
      });
    }
  }
);

// Get reported content
router.get("/reports", authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { db } = await connectDB();

    // Mock reported content for demo
    const reports = [
      {
        _id: "report1",
        type: "listing",
        itemId: "listing123",
        itemTitle: "Suspicious Pet Sale",
        reportedBy: "user@example.com",
        reason: "Suspected scam",
        description: "This listing seems fake and overpriced",
        status: "pending",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        _id: "report2",
        type: "user",
        itemId: "user456",
        itemTitle: "Inappropriate Behavior",
        reportedBy: "another@example.com",
        reason: "Harassment",
        description: "User sent inappropriate messages",
        status: "resolved",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
    ];

    res.json({
      success: true,
      data: reports,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reports",
      error: error.message,
    });
  }
});

// System health check
router.get("/health", authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { db } = await connectDB();

    // Check database connection
    await db.admin().ping();

    // Get system stats
    const stats = await db.stats();

    const health = {
      database: {
        status: "healthy",
        collections: stats.collections,
        dataSize: Math.round(stats.dataSize / 1024 / 1024), // MB
        indexSize: Math.round(stats.indexSize / 1024 / 1024), // MB
      },
      server: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        nodeVersion: process.version,
        platform: process.platform,
      },
      timestamp: new Date(),
    };

    res.json({
      success: true,
      data: health,
    });
  } catch (error) {
    console.error("Error checking system health:", error);
    res.status(500).json({
      success: false,
      message: "System health check failed",
      error: error.message,
    });
  }
});

// Bulk operations
router.post(
  "/bulk-action",
  authenticateUser,
  requireAdmin,
  async (req, res) => {
    try {
      const { db } = await connectDB();
      const { action, itemIds, collection } = req.body;

      if (!action || !itemIds || !Array.isArray(itemIds) || !collection) {
        return res.status(400).json({
          success: false,
          message: "Invalid bulk action parameters",
        });
      }

      const validCollections = ["listings", "orders", "reviews"];
      if (!validCollections.includes(collection)) {
        return res.status(400).json({
          success: false,
          message: "Invalid collection",
        });
      }

      const objectIds = itemIds.map((id) => new ObjectId(id));
      let result;

      switch (action) {
        case "delete":
          result = await db.collection(collection).deleteMany({
            _id: { $in: objectIds },
          });
          break;
        case "suspend":
          result = await db.collection(collection).updateMany(
            { _id: { $in: objectIds } },
            {
              $set: {
                status: "suspended",
                moderatedAt: new Date(),
                moderatedBy: req.user.email,
              },
            }
          );
          break;
        case "approve":
          result = await db.collection(collection).updateMany(
            { _id: { $in: objectIds } },
            {
              $set: {
                status: "active",
                moderatedAt: new Date(),
                moderatedBy: req.user.email,
              },
            }
          );
          break;
        default:
          return res.status(400).json({
            success: false,
            message: "Invalid action",
          });
      }

      res.json({
        success: true,
        message: `Bulk ${action} completed`,
        affected: result.deletedCount || result.modifiedCount || 0,
      });
    } catch (error) {
      console.error("Error performing bulk action:", error);
      res.status(500).json({
        success: false,
        message: "Bulk action failed",
        error: error.message,
      });
    }
  }
);

export default router;

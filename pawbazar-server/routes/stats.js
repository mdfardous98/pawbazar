import express from "express";
import { getDB } from "../config/database.js";
import { authenticateUser, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

// Get public statistics (no auth required)
router.get("/public", async (req, res) => {
  try {
    const db = getDB();

    const [totalListings, totalAdoptions, totalProducts, recentListings] =
      await Promise.all([
        db.collection("listings").countDocuments(),
        db.collection("listings").countDocuments({ price: 0 }),
        db.collection("listings").countDocuments({ price: { $gt: 0 } }),
        db.collection("listings").countDocuments({
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        }),
      ]);

    // Get category breakdown
    const categoryStats = await db
      .collection("listings")
      .aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
            avgPrice: { $avg: "$price" },
          },
        },
        { $sort: { count: -1 } },
      ])
      .toArray();

    // Get location breakdown
    const locationStats = await db
      .collection("listings")
      .aggregate([
        {
          $group: {
            _id: "$location",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ])
      .toArray();

    res.json({
      success: true,
      data: {
        overview: {
          totalListings,
          totalAdoptions,
          totalProducts,
          recentListings,
        },
        categories: categoryStats,
        locations: locationStats,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching public stats:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch statistics",
    });
  }
});

// Get admin statistics (authenticated users only)
router.get("/admin", authenticateUser, async (req, res) => {
  try {
    const db = getDB();

    // Get comprehensive statistics
    const [
      totalUsers,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue,
    ] = await Promise.all([
      db
        .collection("listings")
        .distinct("email")
        .then((emails) => emails.length),
      db.collection("orders").countDocuments(),
      db.collection("orders").countDocuments({ status: "pending" }),
      db.collection("orders").countDocuments({ status: "completed" }),
      db
        .collection("orders")
        .aggregate([
          { $match: { status: { $ne: "cancelled" } } },
          {
            $group: {
              _id: null,
              total: { $sum: { $multiply: ["$price", "$quantity"] } },
            },
          },
        ])
        .toArray()
        .then((result) => result[0]?.total || 0),
    ]);

    // Get daily statistics for the last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const dailyStats = await db
      .collection("listings")
      .aggregate([
        {
          $match: {
            createdAt: { $gte: thirtyDaysAgo },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            listings: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    const dailyOrders = await db
      .collection("orders")
      .aggregate([
        {
          $match: {
            createdAt: { $gte: thirtyDaysAgo },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            orders: { $sum: 1 },
            revenue: { $sum: { $multiply: ["$price", "$quantity"] } },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    // Get top performing listings
    const topListings = await db
      .collection("orders")
      .aggregate([
        {
          $group: {
            _id: "$productId",
            productName: { $first: "$productName" },
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: { $multiply: ["$price", "$quantity"] } },
          },
        },
        { $sort: { totalOrders: -1 } },
        { $limit: 10 },
      ])
      .toArray();

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalOrders,
          pendingOrders,
          completedOrders,
          totalRevenue,
        },
        trends: {
          dailyListings: dailyStats,
          dailyOrders: dailyOrders,
        },
        topPerformers: topListings,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch admin statistics",
    });
  }
});

// Get user-specific statistics
router.get("/user", authenticateUser, async (req, res) => {
  try {
    const db = getDB();
    const userEmail = req.user.email;

    const [userListings, userOrders, totalViews, totalRevenue] =
      await Promise.all([
        db.collection("listings").countDocuments({ email: userEmail }),
        db.collection("orders").countDocuments({ email: userEmail }),
        // Placeholder for views (would need to implement view tracking)
        Promise.resolve(0),
        db
          .collection("orders")
          .aggregate([
            { $match: { email: userEmail, status: { $ne: "cancelled" } } },
            {
              $group: {
                _id: null,
                total: { $sum: { $multiply: ["$price", "$quantity"] } },
              },
            },
          ])
          .toArray()
          .then((result) => result[0]?.total || 0),
      ]);

    // Get user's listing performance
    const listingPerformance = await db
      .collection("listings")
      .aggregate([
        { $match: { email: userEmail } },
        {
          $lookup: {
            from: "orders",
            localField: "_id",
            foreignField: "productId",
            as: "orders",
          },
        },
        {
          $project: {
            name: 1,
            category: 1,
            price: 1,
            createdAt: 1,
            orderCount: { $size: "$orders" },
            revenue: {
              $sum: {
                $map: {
                  input: "$orders",
                  as: "order",
                  in: { $multiply: ["$$order.price", "$$order.quantity"] },
                },
              },
            },
          },
        },
        { $sort: { orderCount: -1 } },
      ])
      .toArray();

    // Get monthly activity
    const monthlyActivity = await db
      .collection("listings")
      .aggregate([
        {
          $match: {
            email: userEmail,
            createdAt: {
              $gte: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000),
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            listings: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ])
      .toArray();

    res.json({
      success: true,
      data: {
        overview: {
          totalListings: userListings,
          totalOrders: userOrders,
          totalViews,
          totalRevenue,
        },
        performance: listingPerformance,
        activity: monthlyActivity,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch user statistics",
    });
  }
});

export default router;

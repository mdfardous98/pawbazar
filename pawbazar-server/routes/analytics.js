import express from "express";
import { getDB } from "../config/database.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

// Get dashboard analytics (authenticated users only)
router.get("/dashboard", authenticateUser, async (req, res) => {
  try {
    const db = getDB();
    const userEmail = req.user.email;

    // Get user's listing analytics
    const userListings = await db
      .collection("listings")
      .find({ email: userEmail })
      .toArray();
    const listingIds = userListings.map((listing) => listing._id.toString());

    // Get orders for user's listings
    const ordersForUserListings = await db
      .collection("orders")
      .find({
        productId: { $in: listingIds },
      })
      .toArray();

    // Get user's own orders
    const userOrders = await db
      .collection("orders")
      .find({ email: userEmail })
      .toArray();

    // Calculate metrics
    const totalListings = userListings.length;
    const totalOrdersReceived = ordersForUserListings.length;
    const totalOrdersPlaced = userOrders.length;
    const totalRevenue = ordersForUserListings.reduce(
      (sum, order) => sum + order.price * order.quantity,
      0
    );
    const totalSpent = userOrders.reduce(
      (sum, order) => sum + order.price * order.quantity,
      0
    );

    // Category breakdown
    const categoryBreakdown = userListings.reduce((acc, listing) => {
      acc[listing.category] = (acc[listing.category] || 0) + 1;
      return acc;
    }, {});

    // Monthly activity (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyActivity = await db
      .collection("listings")
      .aggregate([
        {
          $match: {
            email: userEmail,
            createdAt: { $gte: sixMonthsAgo },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ])
      .toArray();

    // Recent activity
    const recentListings = userListings
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    const recentOrders = userOrders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    res.json({
      success: true,
      data: {
        overview: {
          totalListings,
          totalOrdersReceived,
          totalOrdersPlaced,
          totalRevenue,
          totalSpent,
        },
        categoryBreakdown,
        monthlyActivity,
        recentActivity: {
          listings: recentListings,
          orders: recentOrders,
        },
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard analytics:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch dashboard analytics",
    });
  }
});

// Get platform-wide analytics (public)
router.get("/platform", async (req, res) => {
  try {
    const db = getDB();

    // Basic platform metrics
    const [totalListings, totalOrders, totalUsers, adoptionListings] =
      await Promise.all([
        db.collection("listings").countDocuments(),
        db.collection("orders").countDocuments(),
        db
          .collection("listings")
          .distinct("email")
          .then((emails) => emails.length),
        db.collection("listings").countDocuments({ price: 0 }),
      ]);

    // Growth metrics (last 30 days vs previous 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

    const [recentListings, previousListings, recentOrders, previousOrders] =
      await Promise.all([
        db
          .collection("listings")
          .countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
        db.collection("listings").countDocuments({
          createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo },
        }),
        db
          .collection("orders")
          .countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
        db.collection("orders").countDocuments({
          createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo },
        }),
      ]);

    // Calculate growth percentages
    const listingsGrowth =
      previousListings > 0
        ? (
            ((recentListings - previousListings) / previousListings) *
            100
          ).toFixed(1)
        : 0;

    const ordersGrowth =
      previousOrders > 0
        ? (((recentOrders - previousOrders) / previousOrders) * 100).toFixed(1)
        : 0;

    // Top categories
    const topCategories = await db
      .collection("listings")
      .aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
            adoptions: {
              $sum: { $cond: [{ $eq: ["$price", 0] }, 1, 0] },
            },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ])
      .toArray();

    // Top locations
    const topLocations = await db
      .collection("listings")
      .aggregate([
        {
          $group: {
            _id: "$location",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ])
      .toArray();

    res.json({
      success: true,
      data: {
        overview: {
          totalListings,
          totalOrders,
          totalUsers,
          adoptionListings,
          adoptionRate:
            totalListings > 0
              ? ((adoptionListings / totalListings) * 100).toFixed(1)
              : 0,
        },
        growth: {
          listings: {
            recent: recentListings,
            previous: previousListings,
            growth: listingsGrowth,
          },
          orders: {
            recent: recentOrders,
            previous: previousOrders,
            growth: ordersGrowth,
          },
        },
        topCategories,
        topLocations,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching platform analytics:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch platform analytics",
    });
  }
});

export default router;

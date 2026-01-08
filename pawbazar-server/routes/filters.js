import express from "express";
import { connectDB } from "../config/database.js";

const router = express.Router();

// Get price range for listings
router.get("/price-range", async (req, res) => {
  try {
    const { db } = await connectDB();
    const { category } = req.query;

    const query = category && category !== "all" ? { category } : {};

    const priceStats = await db
      .collection("listings")
      .aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            minPrice: { $min: "$price" },
            maxPrice: { $max: "$price" },
            avgPrice: { $avg: "$price" },
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    const result = priceStats[0] || {
      minPrice: 0,
      maxPrice: 0,
      avgPrice: 0,
      count: 0,
    };

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching price range:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch price range",
      error: error.message,
    });
  }
});

// Get available locations
router.get("/locations", async (req, res) => {
  try {
    const { db } = await connectDB();

    const locations = await db.collection("listings").distinct("location");

    // Sort locations alphabetically
    locations.sort();

    res.json({
      success: true,
      data: locations,
    });
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch locations",
      error: error.message,
    });
  }
});

// Get filter options summary
router.get("/summary", async (req, res) => {
  try {
    const { db } = await connectDB();

    // Get categories with counts
    const categories = await db
      .collection("listings")
      .aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ])
      .toArray();

    // Get locations with counts
    const locations = await db
      .collection("listings")
      .aggregate([
        {
          $group: {
            _id: "$location",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ])
      .toArray();

    // Get price ranges
    const priceRanges = await db
      .collection("listings")
      .aggregate([
        {
          $bucket: {
            groupBy: "$price",
            boundaries: [0, 50, 100, 200, 500, 1000, Infinity],
            default: "Other",
            output: {
              count: { $sum: 1 },
              avgPrice: { $avg: "$price" },
            },
          },
        },
      ])
      .toArray();

    // Get date ranges (last 7 days, 30 days, etc.)
    const now = new Date();
    const dateRanges = await db
      .collection("listings")
      .aggregate([
        {
          $addFields: {
            daysSinceCreated: {
              $divide: [
                { $subtract: [now, "$createdAt"] },
                1000 * 60 * 60 * 24,
              ],
            },
          },
        },
        {
          $bucket: {
            groupBy: "$daysSinceCreated",
            boundaries: [0, 1, 7, 30, 90, Infinity],
            default: "Older",
            output: {
              count: { $sum: 1 },
            },
          },
        },
      ])
      .toArray();

    res.json({
      success: true,
      data: {
        categories: categories.map((cat) => ({
          name: cat._id,
          count: cat.count,
        })),
        locations: locations.map((loc) => ({
          name: loc._id,
          count: loc.count,
        })),
        priceRanges,
        dateRanges,
      },
    });
  } catch (error) {
    console.error("Error fetching filter summary:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch filter summary",
      error: error.message,
    });
  }
});

export default router;

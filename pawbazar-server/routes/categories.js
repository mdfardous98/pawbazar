import express from "express";
import { connectDB } from "../config/database.js";

const router = express.Router();

// Get all categories with listing counts
router.get("/", async (req, res) => {
  try {
    const { db } = await connectDB();

    // Get distinct categories from listings
    const categories = await db.collection("listings").distinct("category");

    // Get count for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const count = await db
          .collection("listings")
          .countDocuments({ category });
        return { name: category, count };
      })
    );

    // Add "All" category with total count
    const totalCount = await db.collection("listings").countDocuments();
    const allCategories = [
      { name: "All", count: totalCount },
      ...categoriesWithCounts.sort((a, b) => b.count - a.count),
    ];

    res.json({
      success: true,
      data: allCategories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
});

// Get category statistics
router.get("/stats", async (req, res) => {
  try {
    const { db } = await connectDB();

    const stats = await db
      .collection("listings")
      .aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
            avgPrice: { $avg: "$price" },
            minPrice: { $min: "$price" },
            maxPrice: { $max: "$price" },
          },
        },
        {
          $sort: { count: -1 },
        },
      ])
      .toArray();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching category stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch category statistics",
      error: error.message,
    });
  }
});

export default router;

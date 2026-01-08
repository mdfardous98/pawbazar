import express from "express";
import { getDB } from "../config/database.js";
import { optionalAuth } from "../middleware/auth.js";

const router = express.Router();

// Advanced search endpoint
router.get("/", optionalAuth, async (req, res) => {
  try {
    const db = getDB();
    const {
      q, // search query
      category,
      minPrice,
      maxPrice,
      location,
      dateFrom,
      dateTo,
      sortBy = "relevance",
      order = "desc",
      page = 1,
      limit = 12,
    } = req.query;

    // Build search query
    const searchQuery = {};

    // Text search
    if (q) {
      searchQuery.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
      ];
    }

    // Category filter
    if (category && category !== "all") {
      searchQuery.category = { $regex: category, $options: "i" };
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      searchQuery.price = {};
      if (minPrice !== undefined) {
        searchQuery.price.$gte = parseFloat(minPrice);
      }
      if (maxPrice !== undefined) {
        searchQuery.price.$lte = parseFloat(maxPrice);
      }
    }

    // Location filter
    if (location) {
      searchQuery.location = { $regex: location, $options: "i" };
    }

    // Date range filter
    if (dateFrom || dateTo) {
      searchQuery.createdAt = {};
      if (dateFrom) {
        searchQuery.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        searchQuery.createdAt.$lte = new Date(dateTo);
      }
    }

    // Build sort object
    let sortObj = {};
    switch (sortBy) {
      case "price":
        sortObj.price = order === "asc" ? 1 : -1;
        break;
      case "name":
        sortObj.name = order === "asc" ? 1 : -1;
        break;
      case "location":
        sortObj.location = order === "asc" ? 1 : -1;
        break;
      case "category":
        sortObj.category = order === "asc" ? 1 : -1;
        break;
      case "relevance":
      default:
        // For text search, use text score for relevance
        if (q) {
          sortObj = { score: { $meta: "textScore" } };
        } else {
          sortObj.createdAt = -1; // Default to newest first
        }
        break;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute search with aggregation for better performance
    const pipeline = [{ $match: searchQuery }];

    // Add text score for relevance sorting
    if (q && sortBy === "relevance") {
      pipeline.unshift({
        $match: {
          $text: { $search: q },
        },
      });
      pipeline.push({
        $addFields: { score: { $meta: "textScore" } },
      });
    }

    pipeline.push(
      { $sort: sortObj },
      { $skip: skip },
      { $limit: parseInt(limit) }
    );

    const [results, totalCount] = await Promise.all([
      db.collection("listings").aggregate(pipeline).toArray(),
      db.collection("listings").countDocuments(searchQuery),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / parseInt(limit));
    const hasNext = parseInt(page) < totalPages;
    const hasPrev = parseInt(page) > 1;

    res.json({
      success: true,
      data: results,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: totalCount,
        itemsPerPage: parseInt(limit),
        hasNext,
        hasPrev,
      },
      searchInfo: {
        query: q || "",
        filters: {
          category: category || "all",
          minPrice: minPrice || null,
          maxPrice: maxPrice || null,
          location: location || null,
          dateFrom: dateFrom || null,
          dateTo: dateTo || null,
        },
        sortBy,
        order,
      },
    });
  } catch (error) {
    console.error("Error performing search:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Search failed",
    });
  }
});

// Search suggestions endpoint
router.get("/suggestions", async (req, res) => {
  try {
    const db = getDB();
    const { q, limit = 5 } = req.query;

    if (!q || q.length < 2) {
      return res.json({
        success: true,
        data: [],
      });
    }

    // Get suggestions from different fields
    const [namesSuggestions, categorySuggestions, locationSuggestions] =
      await Promise.all([
        // Names
        db
          .collection("listings")
          .aggregate([
            {
              $match: {
                name: { $regex: q, $options: "i" },
              },
            },
            {
              $group: {
                _id: "$name",
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1 } },
            { $limit: parseInt(limit) },
            {
              $project: {
                text: "$_id",
                type: "name",
                count: 1,
                _id: 0,
              },
            },
          ])
          .toArray(),

        // Categories
        db
          .collection("listings")
          .aggregate([
            {
              $match: {
                category: { $regex: q, $options: "i" },
              },
            },
            {
              $group: {
                _id: "$category",
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1 } },
            { $limit: parseInt(limit) },
            {
              $project: {
                text: "$_id",
                type: "category",
                count: 1,
                _id: 0,
              },
            },
          ])
          .toArray(),

        // Locations
        db
          .collection("listings")
          .aggregate([
            {
              $match: {
                location: { $regex: q, $options: "i" },
              },
            },
            {
              $group: {
                _id: "$location",
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1 } },
            { $limit: parseInt(limit) },
            {
              $project: {
                text: "$_id",
                type: "location",
                count: 1,
                _id: 0,
              },
            },
          ])
          .toArray(),
      ]);

    // Combine and sort suggestions
    const allSuggestions = [
      ...namesSuggestions,
      ...categorySuggestions,
      ...locationSuggestions,
    ]
      .sort((a, b) => b.count - a.count)
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      data: allSuggestions,
    });
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch suggestions",
    });
  }
});

// Popular searches endpoint
router.get("/popular", async (req, res) => {
  try {
    const db = getDB();
    const { limit = 10 } = req.query;

    // Get popular categories
    const popularCategories = await db
      .collection("listings")
      .aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: parseInt(limit) },
        {
          $project: {
            text: "$_id",
            type: "category",
            count: 1,
            _id: 0,
          },
        },
      ])
      .toArray();

    // Get popular locations
    const popularLocations = await db
      .collection("listings")
      .aggregate([
        {
          $group: {
            _id: "$location",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: parseInt(limit) },
        {
          $project: {
            text: "$_id",
            type: "location",
            count: 1,
            _id: 0,
          },
        },
      ])
      .toArray();

    res.json({
      success: true,
      data: {
        categories: popularCategories,
        locations: popularLocations,
      },
    });
  } catch (error) {
    console.error("Error fetching popular searches:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch popular searches",
    });
  }
});

export default router;

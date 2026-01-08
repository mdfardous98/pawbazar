import express from "express";
import { ObjectId } from "mongodb";
import { connectDB } from "../config/database.js";
import { authenticateUser, optionalAuth } from "../middleware/auth.js";
import { validateListing } from "../middleware/validation.js";

const router = express.Router();

// Get all listings with optional filters
router.get("/", optionalAuth, async (req, res) => {
  try {
    const { db } = await connectDB();
    const {
      category,
      search,
      sort = "date",
      order = "desc",
      limit = 20,
      page = 1,
    } = req.query;

    // Build query
    const query = {};

    if (category && category !== "all") {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    // Build sort object
    const sortObj = {};
    if (sort === "price") {
      sortObj.price = order === "asc" ? 1 : -1;
    } else if (sort === "name") {
      sortObj.name = order === "asc" ? 1 : -1;
    } else {
      sortObj.date = order === "asc" ? 1 : -1;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get listings with pagination
    const listings = await db
      .collection("listings")
      .find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    // Get total count for pagination
    const total = await db.collection("listings").countDocuments(query);

    res.json({
      success: true,
      data: listings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch listings",
      error: error.message,
    });
  }
});

// Get recent listings for home page
router.get("/recent", async (req, res) => {
  try {
    const { db } = await connectDB();
    const { limit = 6 } = req.query;

    const listings = await db
      .collection("listings")
      .find({})
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .toArray();

    res.json({
      success: true,
      data: listings,
      count: listings.length,
    });
  } catch (error) {
    console.error("Error fetching recent listings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent listings",
      error: error.message,
    });
  }
});

// Get single listing by ID
router.get("/:id", async (req, res) => {
  try {
    const { db } = await connectDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid listing ID",
      });
    }

    const listing = await db.collection("listings").findOne({
      _id: new ObjectId(id),
    });

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    res.json({
      success: true,
      data: listing,
    });
  } catch (error) {
    console.error("Error fetching listing:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch listing",
      error: error.message,
    });
  }
});

// Get user's listings
router.get("/user/my-listings", authenticateUser, async (req, res) => {
  try {
    const { db } = await connectDB();
    const { email } = req.user;

    const listings = await db
      .collection("listings")
      .find({ email })
      .sort({ date: -1 })
      .toArray();

    res.json({
      success: true,
      data: listings,
      count: listings.length,
    });
  } catch (error) {
    console.error("Error fetching user listings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch your listings",
      error: error.message,
    });
  }
});

// Create new listing
router.post("/", authenticateUser, validateListing, async (req, res) => {
  try {
    const { db } = await connectDB();
    const { email } = req.user;

    const listingData = {
      ...req.body,
      email,
      date: new Date().toISOString().split("T")[0],
      createdAt: new Date(),
    };

    const result = await db.collection("listings").insertOne(listingData);

    res.status(201).json({
      success: true,
      message: "Listing created successfully",
      data: {
        _id: result.insertedId,
        ...listingData,
      },
    });
  } catch (error) {
    console.error("Error creating listing:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create listing",
      error: error.message,
    });
  }
});

// Update listing
router.put("/:id", authenticateUser, validateListing, async (req, res) => {
  try {
    const { db } = await connectDB();
    const { id } = req.params;
    const { email } = req.user;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid listing ID",
      });
    }

    const updateData = {
      ...req.body,
      updatedAt: new Date(),
    };

    const result = await db.collection("listings").updateOne(
      { _id: new ObjectId(id), email }, // Ensure user can only update their own listings
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Listing not found or you don't have permission to update it",
      });
    }

    res.json({
      success: true,
      message: "Listing updated successfully",
    });
  } catch (error) {
    console.error("Error updating listing:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update listing",
      error: error.message,
    });
  }
});

// Delete listing
router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const { db } = await connectDB();
    const { id } = req.params;
    const { email } = req.user;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid listing ID",
      });
    }

    const result = await db.collection("listings").deleteOne({
      _id: new ObjectId(id),
      email, // Ensure user can only delete their own listings
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Listing not found or you don't have permission to delete it",
      });
    }

    res.json({
      success: true,
      message: "Listing deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting listing:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete listing",
      error: error.message,
    });
  }
});

export default router;

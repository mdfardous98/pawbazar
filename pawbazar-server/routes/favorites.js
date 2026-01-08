import express from "express";
import { ObjectId } from "mongodb";
import { connectDB } from "../config/database.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

// Get user's favorite listings
router.get("/", authenticateUser, async (req, res) => {
  try {
    const { db } = await connectDB();
    const { email } = req.user;

    // Get user's favorites
    const favorites = await db
      .collection("favorites")
      .find({ userEmail: email })
      .toArray();

    if (favorites.length === 0) {
      return res.json({
        success: true,
        data: [],
        count: 0,
      });
    }

    // Get listing details for favorites
    const listingIds = favorites.map((fav) => new ObjectId(fav.listingId));
    const listings = await db
      .collection("listings")
      .find({ _id: { $in: listingIds } })
      .toArray();

    // Add favorite date to listings
    const favoritesWithDetails = listings.map((listing) => {
      const favorite = favorites.find(
        (fav) => fav.listingId === listing._id.toString()
      );
      return {
        ...listing,
        favoriteDate: favorite?.createdAt,
      };
    });

    res.json({
      success: true,
      data: favoritesWithDetails,
      count: favoritesWithDetails.length,
    });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch favorites",
      error: error.message,
    });
  }
});

// Add listing to favorites
router.post("/:listingId", authenticateUser, async (req, res) => {
  try {
    const { db } = await connectDB();
    const { listingId } = req.params;
    const { email } = req.user;

    if (!ObjectId.isValid(listingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid listing ID",
      });
    }

    // Check if listing exists
    const listing = await db.collection("listings").findOne({
      _id: new ObjectId(listingId),
    });

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    // Check if already favorited
    const existingFavorite = await db.collection("favorites").findOne({
      userEmail: email,
      listingId: listingId,
    });

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: "Listing already in favorites",
      });
    }

    // Add to favorites
    const favoriteData = {
      userEmail: email,
      listingId: listingId,
      listingName: listing.name,
      createdAt: new Date(),
    };

    await db.collection("favorites").insertOne(favoriteData);

    res.status(201).json({
      success: true,
      message: "Added to favorites successfully",
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
router.delete("/:listingId", authenticateUser, async (req, res) => {
  try {
    const { db } = await connectDB();
    const { listingId } = req.params;
    const { email } = req.user;

    const result = await db.collection("favorites").deleteOne({
      userEmail: email,
      listingId: listingId,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Favorite not found",
      });
    }

    res.json({
      success: true,
      message: "Removed from favorites successfully",
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

// Check if listing is favorited by user
router.get("/check/:listingId", authenticateUser, async (req, res) => {
  try {
    const { db } = await connectDB();
    const { listingId } = req.params;
    const { email } = req.user;

    const favorite = await db.collection("favorites").findOne({
      userEmail: email,
      listingId: listingId,
    });

    res.json({
      success: true,
      isFavorite: !!favorite,
    });
  } catch (error) {
    console.error("Error checking favorite status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check favorite status",
      error: error.message,
    });
  }
});

export default router;

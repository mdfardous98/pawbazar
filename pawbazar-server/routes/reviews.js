import express from "express";
import { ObjectId } from "mongodb";
import { connectDB } from "../config/database.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

// Get reviews for a listing
router.get("/listing/:listingId", async (req, res) => {
  try {
    const { db } = await connectDB();
    const { listingId } = req.params;

    if (!ObjectId.isValid(listingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid listing ID",
      });
    }

    const reviews = await db
      .collection("reviews")
      .find({ listingId })
      .sort({ createdAt: -1 })
      .toArray();

    // Calculate average rating
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    res.json({
      success: true,
      data: {
        reviews,
        averageRating: Math.round(avgRating * 10) / 10,
        totalReviews: reviews.length,
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
});

// Add a review
router.post("/", authenticateUser, async (req, res) => {
  try {
    const { db } = await connectDB();
    const { email, displayName } = req.user;
    const { listingId, rating, comment } = req.body;

    // Validation
    if (!listingId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Invalid review data. Rating must be between 1 and 5.",
      });
    }

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

    // Check if user already reviewed this listing
    const existingReview = await db.collection("reviews").findOne({
      listingId,
      reviewerEmail: email,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this listing",
      });
    }

    // Create review
    const reviewData = {
      listingId,
      listingName: listing.name,
      reviewerEmail: email,
      reviewerName: displayName || email.split("@")[0],
      rating: parseInt(rating),
      comment: comment || "",
      createdAt: new Date(),
    };

    const result = await db.collection("reviews").insertOne(reviewData);

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: {
        _id: result.insertedId,
        ...reviewData,
      },
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add review",
      error: error.message,
    });
  }
});

// Update a review
router.put("/:reviewId", authenticateUser, async (req, res) => {
  try {
    const { db } = await connectDB();
    const { reviewId } = req.params;
    const { email } = req.user;
    const { rating, comment } = req.body;

    if (!ObjectId.isValid(reviewId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID",
      });
    }

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const updateData = {
      rating: parseInt(rating),
      comment: comment || "",
      updatedAt: new Date(),
    };

    const result = await db
      .collection("reviews")
      .updateOne(
        { _id: new ObjectId(reviewId), reviewerEmail: email },
        { $set: updateData }
      );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Review not found or you don't have permission to update it",
      });
    }

    res.json({
      success: true,
      message: "Review updated successfully",
    });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update review",
      error: error.message,
    });
  }
});

// Delete a review
router.delete("/:reviewId", authenticateUser, async (req, res) => {
  try {
    const { db } = await connectDB();
    const { reviewId } = req.params;
    const { email } = req.user;

    if (!ObjectId.isValid(reviewId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID",
      });
    }

    const result = await db.collection("reviews").deleteOne({
      _id: new ObjectId(reviewId),
      reviewerEmail: email,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Review not found or you don't have permission to delete it",
      });
    }

    res.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete review",
      error: error.message,
    });
  }
});

// Get user's reviews
router.get("/user/my-reviews", authenticateUser, async (req, res) => {
  try {
    const { db } = await connectDB();
    const { email } = req.user;

    const reviews = await db
      .collection("reviews")
      .find({ reviewerEmail: email })
      .sort({ createdAt: -1 })
      .toArray();

    res.json({
      success: true,
      data: reviews,
      count: reviews.length,
    });
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch your reviews",
      error: error.message,
    });
  }
});

export default router;

import express from "express";
import { ObjectId } from "mongodb";
import { connectDB } from "../config/database.js";
import { authenticateUser } from "../middleware/auth.js";
import { validateOrder } from "../middleware/validation.js";

const router = express.Router();

// Get all orders (admin) or user's orders
router.get("/", authenticateUser, async (req, res) => {
  try {
    const { db } = await connectDB();
    const { email } = req.user;

    // Get user's orders only
    const orders = await db
      .collection("orders")
      .find({ email })
      .sort({ date: -1 })
      .toArray();

    res.json({
      success: true,
      data: orders,
      count: orders.length,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
});

// Get single order by ID
router.get("/:id", authenticateUser, async (req, res) => {
  try {
    const { db } = await connectDB();
    const { id } = req.params;
    const { email } = req.user;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await db.collection("orders").findOne({
      _id: new ObjectId(id),
      email, // Ensure user can only access their own orders
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
});

// Create new order
router.post("/", authenticateUser, validateOrder, async (req, res) => {
  try {
    const { db } = await connectDB();
    const { email } = req.user;
    const orderData = {
      ...req.body,
      email,
      date: new Date().toISOString().split("T")[0],
      createdAt: new Date(),
      status: "pending",
    };

    const result = await db.collection("orders").insertOne(orderData);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: {
        _id: result.insertedId,
        ...orderData,
      },
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to place order",
      error: error.message,
    });
  }
});

// Update order status (admin only for now)
router.patch("/:id/status", authenticateUser, async (req, res) => {
  try {
    const { db } = await connectDB();
    const { id } = req.params;
    const { status } = req.body;
    const { email } = req.user;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const validStatuses = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const result = await db.collection("orders").updateOne(
      { _id: new ObjectId(id), email },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order status updated successfully",
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
});

// Delete order (user can cancel their own orders)
router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const { db } = await connectDB();
    const { id } = req.params;
    const { email } = req.user;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const result = await db.collection("orders").deleteOne({
      _id: new ObjectId(id),
      email, // Ensure user can only delete their own orders
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
      error: error.message,
    });
  }
});

export default router;

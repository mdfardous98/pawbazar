import express from "express";
import { ObjectId } from "mongodb";
import { connectDB } from "../config/database.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

// Get conversations for a user
router.get("/conversations", authenticateUser, async (req, res) => {
  try {
    const { db } = await connectDB();
    const { email } = req.user;

    // Get all conversations where user is either sender or receiver
    const conversations = await db
      .collection("messages")
      .aggregate([
        {
          $match: {
            $or: [{ senderEmail: email }, { receiverEmail: email }],
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $group: {
            _id: {
              $cond: [
                { $eq: ["$senderEmail", email] },
                "$receiverEmail",
                "$senderEmail",
              ],
            },
            lastMessage: { $first: "$$ROOT" },
            unreadCount: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ["$receiverEmail", email] },
                      { $eq: ["$isRead", false] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
        {
          $sort: { "lastMessage.createdAt": -1 },
        },
      ])
      .toArray();

    res.json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch conversations",
      error: error.message,
    });
  }
});

// Get messages between two users
router.get(
  "/conversation/:otherUserEmail",
  authenticateUser,
  async (req, res) => {
    try {
      const { db } = await connectDB();
      const { email } = req.user;
      const { otherUserEmail } = req.params;

      const messages = await db
        .collection("messages")
        .find({
          $or: [
            { senderEmail: email, receiverEmail: otherUserEmail },
            { senderEmail: otherUserEmail, receiverEmail: email },
          ],
        })
        .sort({ createdAt: 1 })
        .toArray();

      // Mark messages as read
      await db.collection("messages").updateMany(
        {
          senderEmail: otherUserEmail,
          receiverEmail: email,
          isRead: false,
        },
        {
          $set: { isRead: true, readAt: new Date() },
        }
      );

      res.json({
        success: true,
        data: messages,
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch messages",
        error: error.message,
      });
    }
  }
);

// Send a message
router.post("/", authenticateUser, async (req, res) => {
  try {
    const { db } = await connectDB();
    const { email, displayName } = req.user;
    const { receiverEmail, message, listingId } = req.body;

    // Validation
    if (!receiverEmail || !message) {
      return res.status(400).json({
        success: false,
        message: "Receiver email and message are required",
      });
    }

    if (receiverEmail === email) {
      return res.status(400).json({
        success: false,
        message: "Cannot send message to yourself",
      });
    }

    // Get listing info if provided
    let listingInfo = null;
    if (listingId && ObjectId.isValid(listingId)) {
      listingInfo = await db.collection("listings").findOne({
        _id: new ObjectId(listingId),
      });
    }

    const messageData = {
      senderEmail: email,
      senderName: displayName || email.split("@")[0],
      receiverEmail,
      message: message.trim(),
      listingId: listingId || null,
      listingName: listingInfo?.name || null,
      isRead: false,
      createdAt: new Date(),
    };

    const result = await db.collection("messages").insertOne(messageData);

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: {
        _id: result.insertedId,
        ...messageData,
      },
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
});

// Mark messages as read
router.patch("/mark-read", authenticateUser, async (req, res) => {
  try {
    const { db } = await connectDB();
    const { email } = req.user;
    const { senderEmail } = req.body;

    if (!senderEmail) {
      return res.status(400).json({
        success: false,
        message: "Sender email is required",
      });
    }

    const result = await db.collection("messages").updateMany(
      {
        senderEmail,
        receiverEmail: email,
        isRead: false,
      },
      {
        $set: { isRead: true, readAt: new Date() },
      }
    );

    res.json({
      success: true,
      message: "Messages marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark messages as read",
      error: error.message,
    });
  }
});

// Delete a message
router.delete("/:messageId", authenticateUser, async (req, res) => {
  try {
    const { db } = await connectDB();
    const { messageId } = req.params;
    const { email } = req.user;

    if (!ObjectId.isValid(messageId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid message ID",
      });
    }

    const result = await db.collection("messages").deleteOne({
      _id: new ObjectId(messageId),
      senderEmail: email, // Only sender can delete their messages
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Message not found or you don't have permission to delete it",
      });
    }

    res.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete message",
      error: error.message,
    });
  }
});

// Get unread message count
router.get("/unread-count", authenticateUser, async (req, res) => {
  try {
    const { db } = await connectDB();
    const { email } = req.user;

    const count = await db.collection("messages").countDocuments({
      receiverEmail: email,
      isRead: false,
    });

    res.json({
      success: true,
      data: { unreadCount: count },
    });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch unread count",
      error: error.message,
    });
  }
});

export default router;

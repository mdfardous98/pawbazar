import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      // Mock conversations for demo
      const mockConversations = [
        {
          _id: "john.doe@example.com",
          lastMessage: {
            message: "Is the Golden Retriever puppy still available?",
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
            senderEmail: "john.doe@example.com",
          },
          unreadCount: 2,
        },
        {
          _id: "sarah.ahmed@example.com",
          lastMessage: {
            message: "Thank you for your interest in the Persian cat!",
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
            senderEmail: user?.email,
          },
          unreadCount: 0,
        },
      ];
      setConversations(mockConversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast.error("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (otherUserEmail) => {
    try {
      // Mock messages for demo
      const mockMessages = [
        {
          _id: "1",
          senderEmail: otherUserEmail,
          senderName: otherUserEmail.split("@")[0],
          message: "Hi! I'm interested in your listing.",
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
          isRead: true,
        },
        {
          _id: "2",
          senderEmail: user?.email,
          senderName: user?.displayName || "You",
          message: "Hello! Which listing are you interested in?",
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          isRead: true,
        },
        {
          _id: "3",
          senderEmail: otherUserEmail,
          senderName: otherUserEmail.split("@")[0],
          message: "The Golden Retriever puppy. Is it still available?",
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
          isRead: false,
        },
      ];
      setMessages(mockMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    }
  };

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation._id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    setSendingMessage(true);
    try {
      // Mock sending message
      const mockMessage = {
        _id: Date.now().toString(),
        senderEmail: user?.email,
        senderName: user?.displayName || "You",
        message: newMessage.trim(),
        createdAt: new Date(),
        isRead: false,
      };

      setMessages((prev) => [...prev, mockMessage]);
      setNewMessage("");
      toast.success("Message sent!");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffTime = Math.abs(now - messageDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return messageDate.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-base-content mb-2">
            Messages 💬
          </h1>
          <p className="text-base-content/70">
            Communicate with other users about listings
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-base-200 rounded-lg p-4 overflow-y-auto"
          >
            <h2 className="text-lg font-semibold mb-4">Conversations</h2>

            {conversations.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">💬</div>
                <p className="text-base-content/70">No conversations yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation._id}
                    onClick={() => handleConversationSelect(conversation)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedConversation?._id === conversation._id
                        ? "bg-primary text-primary-content"
                        : "bg-base-100 hover:bg-base-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">
                        {conversation._id.split("@")[0]}
                      </span>
                      {conversation.unreadCount > 0 && (
                        <span className="badge badge-error badge-sm">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm opacity-70 truncate">
                      {conversation.lastMessage.message}
                    </p>
                    <p className="text-xs opacity-50 mt-1">
                      {formatDate(conversation.lastMessage.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Messages Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-base-200 rounded-lg flex flex-col"
          >
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-base-300">
                  <h3 className="font-semibold">
                    {selectedConversation._id.split("@")[0]}
                  </h3>
                  <p className="text-sm text-base-content/70">
                    {selectedConversation._id}
                  </p>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex ${
                        message.senderEmail === user?.email
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderEmail === user?.email
                            ? "bg-primary text-primary-content"
                            : "bg-base-100"
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {formatTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-4 border-t border-base-300"
                >
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="input input-bordered flex-1"
                      disabled={sendingMessage}
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || sendingMessage}
                      className="btn btn-primary"
                    >
                      {sendingMessage ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">💬</div>
                  <h3 className="text-xl font-semibold mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-base-content/70">
                    Choose a conversation from the left to start messaging
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Messages;

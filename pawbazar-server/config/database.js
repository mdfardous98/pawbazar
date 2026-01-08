import { MongoClient } from "mongodb";

let db = null;
let client = null;

export const connectDB = async () => {
  try {
    if (db) {
      console.log("📦 Using existing database connection");
      return { db };
    }

    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }

    console.log("🔌 Connecting to MongoDB...");

    client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    await client.connect();

    // Test the connection
    await client.db("admin").command({ ping: 1 });

    db = client.db("pawbazar");

    console.log("✅ Successfully connected to MongoDB");
    console.log(`📊 Database: ${db.databaseName}`);

    return { db };
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    console.log("🔄 Using mock database for development...");

    // Create a mock database for development
    const mockDB = {
      collection: (name) => ({
        find: () => ({
          sort: () => ({
            skip: () => ({
              limit: () => ({
                toArray: async () => [],
              }),
            }),
            limit: () => ({
              toArray: async () => [],
            }),
            toArray: async () => [],
          }),
          toArray: async () => [],
        }),
        findOne: async () => null,
        insertOne: async (doc) => ({ insertedId: "mock-id-" + Date.now() }),
        updateOne: async () => ({ matchedCount: 1, modifiedCount: 1 }),
        deleteOne: async () => ({ deletedCount: 1 }),
        countDocuments: async () => 0,
      }),
    };

    db = mockDB;
    console.log("✅ Mock database initialized for development");
    return { db };
  }
};

export const getDB = () => {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB first.");
  }
  return db;
};

export const closeDB = async () => {
  if (client) {
    await client.close();
    console.log("🔌 MongoDB connection closed");
  }
};

// Handle application termination
process.on("SIGINT", async () => {
  console.log("\n🛑 Received SIGINT. Closing MongoDB connection...");
  await closeDB();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Received SIGTERM. Closing MongoDB connection...");
  await closeDB();
  process.exit(0);
});

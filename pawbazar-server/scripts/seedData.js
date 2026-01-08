import { connectDB } from "../config/database.js";
import dotenv from "dotenv";

dotenv.config();

const sampleListings = [
  {
    name: "Golden Retriever Puppy",
    category: "dogs",
    price: 0,
    location: "Dhaka",
    description:
      "Beautiful 3-month-old Golden Retriever puppy looking for a loving home. Vaccinated and dewormed. Great with kids and other pets. Very playful and friendly nature.",
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    email: "john.doe@example.com",
    date: "2024-01-08",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Persian Cat - Female",
    category: "cats",
    price: 0,
    location: "Chittagong",
    description:
      "Lovely 2-year-old Persian cat seeking a new family. She's spayed, litter trained, and loves to cuddle. Perfect for apartment living.",
    image:
      "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    email: "sarah.ahmed@example.com",
    date: "2024-01-07",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Premium Dog Food - Royal Canin",
    category: "food",
    price: 2500,
    location: "Dhaka",
    description:
      "High-quality Royal Canin dog food, 15kg bag. Suitable for adult dogs. Unopened package, bought extra by mistake. Expires in 2025.",
    image:
      "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    email: "karim.rahman@example.com",
    date: "2024-01-06",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Colorful Budgerigar Pair",
    category: "birds",
    price: 1500,
    location: "Sylhet",
    description:
      "Beautiful pair of budgerigars (male and female). They are healthy, active, and ready to breed. Comes with a small cage and food.",
    image:
      "https://images.unsplash.com/photo-1552728089-57bdde30beb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    email: "fatima.khan@example.com",
    date: "2024-01-05",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Interactive Dog Toy Set",
    category: "toys",
    price: 800,
    location: "Dhaka",
    description:
      "Set of 5 interactive dog toys including rope toys, squeaky toys, and puzzle feeders. Great for keeping dogs entertained and mentally stimulated.",
    image:
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    email: "ahmed.hassan@example.com",
    date: "2024-01-04",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Aquarium with Tropical Fish",
    category: "fish",
    price: 3500,
    location: "Dhaka",
    description:
      "Complete 50-liter aquarium setup with 10 tropical fish, filter, heater, LED lights, and decorations. Perfect for beginners.",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    email: "maria.islam@example.com",
    date: "2024-01-03",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Cat Scratching Post Tower",
    category: "accessories",
    price: 1200,
    location: "Chittagong",
    description:
      "Large cat scratching post with multiple levels, hiding spots, and dangling toys. Excellent condition, barely used. Perfect for active cats.",
    image:
      "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    email: "rashed.ali@example.com",
    date: "2024-01-02",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Labrador Mix Puppy",
    category: "dogs",
    price: 0,
    location: "Rajshahi",
    description:
      "Adorable 4-month-old Labrador mix puppy. Very energetic and loves to play. Looking for an active family with a yard. First vaccination done.",
    image:
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    email: "nasir.uddin@example.com",
    date: "2024-01-01",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Premium Cat Litter - 10kg",
    category: "accessories",
    price: 600,
    location: "Dhaka",
    description:
      "High-quality clumping cat litter, 10kg bag. Dust-free and odor control formula. Unopened package, moving abroad so need to sell quickly.",
    image:
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    email: "lisa.begum@example.com",
    date: "2023-12-31",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Siamese Kitten - Male",
    category: "cats",
    price: 0,
    location: "Barisal",
    description:
      "Beautiful 3-month-old Siamese kitten looking for a loving home. He's playful, curious, and gets along well with children. Litter trained.",
    image:
      "https://images.unsplash.com/photo-1513245543132-31f507417b26?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    email: "ibrahim.khan@example.com",
    date: "2023-12-30",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const sampleOrders = [
  {
    productId: "sample_product_id_1",
    productName: "Premium Dog Food - Royal Canin",
    buyerName: "Aminul Islam",
    email: "aminul@example.com",
    quantity: 1,
    price: 2500,
    address: "House 123, Road 5, Dhanmondi, Dhaka",
    phone: "01712345678",
    date: "2024-01-08",
    additionalNotes: "Please deliver in the evening after 6 PM",
    createdAt: new Date(),
    status: "pending",
  },
  {
    productId: "sample_product_id_2",
    productName: "Interactive Dog Toy Set",
    buyerName: "Rashida Khatun",
    email: "rashida@example.com",
    quantity: 2,
    price: 800,
    address: "Flat 4B, Green View Apartment, Uttara, Dhaka",
    phone: "01798765432",
    date: "2024-01-07",
    additionalNotes: "My dog loves squeaky toys!",
    createdAt: new Date(),
    status: "completed",
  },
];

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    const db = await connectDB();

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await db.collection("listings").deleteMany({});
    await db.collection("orders").deleteMany({});

    // Insert sample listings
    console.log("📝 Inserting sample listings...");
    const listingsResult = await db
      .collection("listings")
      .insertMany(sampleListings);
    console.log(`✅ Inserted ${listingsResult.insertedCount} listings`);

    // Update sample orders with real product IDs
    const insertedListings = await db.collection("listings").find({}).toArray();
    if (insertedListings.length >= 2) {
      sampleOrders[0].productId = insertedListings[2]._id.toString(); // Dog food
      sampleOrders[1].productId = insertedListings[4]._id.toString(); // Dog toys
    }

    // Insert sample orders
    console.log("🛒 Inserting sample orders...");
    const ordersResult = await db.collection("orders").insertMany(sampleOrders);
    console.log(`✅ Inserted ${ordersResult.insertedCount} orders`);

    console.log("🎉 Database seeding completed successfully!");

    // Display summary
    console.log("\n📊 Seeding Summary:");
    console.log(`   • ${listingsResult.insertedCount} listings created`);
    console.log(`   • ${ordersResult.insertedCount} orders created`);
    console.log("\n🔍 Sample data includes:");
    console.log("   • Pet adoptions (dogs, cats, birds)");
    console.log("   • Pet supplies (food, toys, accessories)");
    console.log("   • Various price ranges (free to ৳3500)");
    console.log("   • Multiple locations across Bangladesh");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export { seedDatabase, sampleListings, sampleOrders };

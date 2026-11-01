import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../../shared/config/db.js";
import User from "../auth/auth.model.js";
import BlogPost from "./models/post.model.js";
import BlogCategory from "./models/category.model.js";
import BlogTag from "./models/tag.model.js";
import BlogAuthorProfile from "./models/author.model.js";

async function seedBlogData() {
  await connectDB();

  console.log("Checking existing blog data...");
  const existingPostCount = await BlogPost.countDocuments();
  if (existingPostCount > 0) {
    console.log(`Database already has ${existingPostCount} blog posts. Seeding skipped.`);
    process.exit(0);
  }

  console.log("Seeding initial Blog categories...");
  const categories = await BlogCategory.insertMany([
    {
      name: "Hotel Guides",
      slug: "hotel-guides",
      description: "Curated guides, top luxury & budget hotels across Indian cities.",
      postCount: 1,
    },
    {
      name: "Destinations",
      slug: "destinations",
      description: "City travel guides, itinerary tips, and sight-seeing spots.",
      postCount: 1,
    },
    {
      name: "Travel Tips",
      slug: "travel-tips",
      description: "Budget travel hacks, packing lists, and booking advice.",
      postCount: 1,
    },
    {
      name: "Seasonal Stays",
      slug: "seasonal-stays",
      description: "Winter retreats, monsoon getaways, and summer hill stations.",
      postCount: 0,
    },
  ]);

  console.log("Seeding initial Blog tags...");
  const tags = await BlogTag.insertMany([
    { name: "Indore", slug: "indore" },
    { name: "Udaipur", slug: "udaipur" },
    { name: "Delhi", slug: "delhi" },
    { name: "Luxury Hotels", slug: "luxury-hotels" },
    { name: "Heritage Stays", slug: "heritage-stays" },
    { name: "Couples", slug: "couples" },
  ]);

  // Find or create admin user to associate as author
  let adminUser = await User.findOne({ role: { $in: ["admin", "super_admin"] } });
  if (!adminUser) {
    adminUser = await User.findOne();
  }

  if (!adminUser) {
    adminUser = await User.create({
      email: "admin@trivllo.com",
      role: "admin",
      firstName: "Nishant",
      lastName: "Tyagi",
      phoneNumber: "+919999999999",
      gender: "male",
      country: "India",
    });
  }

  console.log(`Associating author profile with User: ${adminUser.email}`);
  await BlogAuthorProfile.findOneAndUpdate(
    { userId: adminUser._id },
    {
      userId: adminUser._id,
      displayName: `${adminUser.firstName || "Nishant"} ${adminUser.lastName || "Tyagi"}`.trim(),
      slug: "nishant-tyagi",
      bio: "Founder & Lead Editorial Strategist at Trivllo.",
      designation: "Lead Editor",
      isPublic: true,
      avatar: adminUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
    },
    { upsert: true }
  );

  console.log("Seeding sample published blog posts...");
  await BlogPost.create([
    {
      title: "10 Best Hotels to Stay in Indore (2026 Edition)",
      slug: "best-hotels-in-indore",
      excerpt: "Looking for top-rated, couple-friendly and business hotels in Indore? Here is our curated comparison of amenities, locations, and pricing on Trivllo.",
      content: `## Why Indore is the Perfect Central India Hub

Indore has emerged as a powerhouse for both business and cultural tourism. From the architectural marvel of Rajwada Palace to the culinary wonderland of Sarafa Bazaar, millions of travelers search for dependable, premium accommodations each year.

### 1. Sayaji Hotel Indore
Known for its grand hospitality, world-class dining, and spacious executive suites. Located on Vijay Nagar, it is ideal for corporate business and family vacations.

- **Location:** H-1 Scheme No. 54, Vijay Nagar
- **Best For:** Luxury, Conferences, Fine Dining
- **Trivllo Perk:** Instant confirmation & complimentary breakfast

### 2. Radisson Blu Hotel
Offering contemporary rooms, an expansive outdoor pool, and proximity to the city center and Indore Airport.

- **Location:** Ring Road
- **Price Range:** ₹6,500 – ₹11,000/night

> 🏨 **Looking to stay in Indore?** [Compare best rates and instant discounts on Trivllo →](https://trivllo.com/hotels?city=Indore)

### How to Book on Trivllo
All featured hotels can be booked directly on Trivllo with zero hidden charges, flexible cancellation, and 24/7 guest concierge support.`,
      featuredImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&auto=format&fit=crop&q=80",
      imageAlt: "Sayaji luxury hotel Indore swimming pool and suites",
      authorId: adminUser._id,
      status: "PUBLISHED",
      readingTime: 4,
      isFeatured: true,
      publishedAt: new Date("2026-10-15T10:00:00Z"),
      categories: [categories[0]._id],
      tags: [tags[0]._id, tags[3]._id, tags[5]._id],
      seo: {
        metaTitle: "10 Best Hotels in Indore (2026 Edition) — Verified Stays | Trivllo",
        metaDescription: "Discover top hotels in Indore for couples, families & corporate stays. Compare amenities, genuine reviews & book with best rates on Trivllo.",
        canonicalUrl: "https://trivllo.com/blog/best-hotels-in-indore",
        ogTitle: "10 Best Hotels in Indore (2026 Edition) | Trivllo",
        ogDescription: "Discover top hotels in Indore for couples, families & corporate stays on Trivllo.",
        ogImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&auto=format&fit=crop&q=80",
        robotsIndex: true,
        robotsFollow: true,
        schemaType: "BlogPosting",
      },
      viewsCount: 3420,
    },
    {
      title: "Top Places to Visit in Udaipur: Royal Palaces & Lake Stays",
      slug: "top-places-to-visit-in-udaipur",
      excerpt: "Experience the romance of Lake Pichola, City Palace, and heritage havelis with this complete traveler's itinerary and hotel guide.",
      content: `## The Venice of the East

Udaipur is one of India's most enchanting destinations. Whether you are planning a destination wedding, romantic honeymoon, or heritage exploration, here is your essential guide.

### Must-Visit Landmarks
1. **City Palace Complex:** Marvel at Rajput architecture overlooking Lake Pichola.
2. **Jagmandir Island Palace:** An island sanctuary accessible by scenic ferry.
3. **Saheliyon-ki-Bari:** Serene courtyards with marble fountains and lotus pools.

> 🏨 **Experience Royal Rajasthan:** [Book Lake Pichola Heritage Stays on Trivllo →](https://trivllo.com/hotels?city=Udaipur)`,
      featuredImage: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1000&auto=format&fit=crop&q=80",
      imageAlt: "Lake Pichola and palace in Udaipur Rajasthan",
      authorId: adminUser._id,
      status: "PUBLISHED",
      readingTime: 5,
      isFeatured: true,
      publishedAt: new Date("2026-10-22T09:00:00Z"),
      categories: [categories[1]._id],
      tags: [tags[1]._id, tags[4]._id],
      seo: {
        metaTitle: "Top Places to Visit in Udaipur (2026 Guide) | Trivllo",
        metaDescription: "Plan your trip to Udaipur. Explore City Palace, Lake Pichola & royal heritage hotels. Book verified stays with Trivllo.",
        canonicalUrl: "https://trivllo.com/blog/top-places-to-visit-in-udaipur",
        ogTitle: "Top Places to Visit in Udaipur (2026 Guide) | Trivllo",
        ogDescription: "Plan your trip to Udaipur with Trivllo verified stays.",
        ogImage: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1000&auto=format&fit=crop&q=80",
        robotsIndex: true,
        robotsFollow: true,
        schemaType: "BlogPosting",
      },
      viewsCount: 5120,
    },
    {
      title: "Weekend Getaways Near Delhi: Quiet Resorts Under 4 Hours",
      slug: "weekend-getaways-near-delhi",
      excerpt: "Escape the NCR rush. Top boutique resorts and heritage forts near Neemrana, Manesar, and Sariska for a relaxing weekend.",
      content: `## Break Away from the City Rush

Need a rejuvenating weekend retreat without a long flight? Delhi NCR is surrounded by historic forts, eco-lodges, and luxury golf resorts located just 2 to 4 hours away.

### Top Recommendations
- **Neemrana Fort-Palace:** 15th-century heritage tier with vintage car rides and zip-lining.
- **Sariska Wilderness Lodges:** Jungle safaris and starlit bonfires near the tiger reserve.
- **Manesar Luxury Farm Stays:** Sprawling green lawns, private pools, and organic farm dining.`,
      featuredImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1000&auto=format&fit=crop&q=80",
      imageAlt: "Luxury resort estate for weekend getaway near Delhi",
      authorId: adminUser._id,
      status: "DRAFT",
      readingTime: 3,
      isFeatured: false,
      categories: [categories[2]._id],
      tags: [tags[2]._id, tags[3]._id],
      seo: {
        metaTitle: "Best Weekend Getaways Near Delhi: Top Resorts | Trivllo",
        metaDescription: "Discover relaxing weekend getaways near Delhi. Handpicked resorts within 4 hours drive with pool, dining, and scenic views on Trivllo.",
        canonicalUrl: "https://trivllo.com/blog/weekend-getaways-near-delhi",
        robotsIndex: false,
        robotsFollow: true,
        schemaType: "BlogPosting",
      },
      viewsCount: 0,
    },
  ]);

  console.log("Blog data seeded successfully into MongoDB!");
  process.exit(0);
}

seedBlogData().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});

import PopularSection, { IPopularSection } from "./popularSection.model.js";

export const DEFAULT_HOTEL_SECTIONS = [
  {
    tagline: "Popular Stays in Manali",
    city: "Manali",
    aliases: ["Siyal", "Simsa", "Old Manali", "Solang", "Vashisht", "Aleo"],
    order: 0,
    category: "hotel" as const,
    limit: 12,
  },
  {
    tagline: "Popular Stays in Shimla",
    city: "Shimla",
    aliases: ["Sanjauli", "Kufri", "Mashobra", "Chotta Shimla", "Bhattakufer", "Dhalli"],
    order: 1,
    category: "hotel" as const,
    limit: 12,
  },
  {
    tagline: "Popular Stays in Srinagar",
    city: "Srinagar",
    aliases: ["Dal Lake", "Lal Chowk", "Dalgate", "Nishat", "Shalimar"],
    order: 2,
    category: "hotel" as const,
    limit: 12,
  },
  {
    tagline: "Luxury in Indore",
    city: "Indore",
    aliases: [],
    order: 3,
    category: "hotel" as const,
    limit: 12,
  },
  {
    tagline: "Popular Homes In South Goa",
    city: "Goa",
    aliases: ["South Goa", "North Goa", "Calangute", "Candolim", "Baga", "Anjuna", "Panaji", "Vasco"],
    order: 4,
    category: "hotel" as const,
    limit: 12,
  },
  {
    tagline: "Best in Delhi",
    city: "Delhi",
    aliases: ["New Delhi", "Delhi NCR", "South Delhi", "Dwarka"],
    order: 5,
    category: "hotel" as const,
    limit: 12,
  },
  {
    tagline: "Popular Stays In Bengaluru",
    city: "Bengaluru",
    aliases: ["Bangalore", "Whitefield", "Koramangala", "Indiranagar", "Electronic City"],
    order: 6,
    category: "hotel" as const,
    limit: 12,
  },
  {
    tagline: "Popular Homes In Rishikesh",
    city: "Rishikesh",
    aliases: ["Tapovan", "Laxman Jhula", "Ram Jhula", "Shivpuri"],
    order: 7,
    category: "hotel" as const,
    limit: 12,
  },
  {
    tagline: "Luxury in Mumbai",
    city: "Mumbai",
    aliases: ["Navi Mumbai", "Thane", "Andheri", "Bandra", "Juhu", "Colaba"],
    order: 8,
    category: "hotel" as const,
    limit: 12,
  },
  {
    tagline: "Stays in Gwalior",
    city: "Gwalior",
    aliases: [],
    order: 9,
    category: "hotel" as const,
    limit: 12,
  },
  {
    tagline: "Villas & Resorts in Udaipur",
    city: "Udaipur",
    aliases: [],
    order: 10,
    category: "hotel" as const,
    limit: 12,
  },
  {
    tagline: "Stays in Jaipur",
    city: "Jaipur",
    aliases: [],
    order: 11,
    category: "hotel" as const,
    limit: 12,
  },
  {
    tagline: "Luxury Rentals in Lonavala",
    city: "Lonavala",
    aliases: ["Khandala"],
    order: 12,
    category: "hotel" as const,
    limit: 12,
  },
  {
    tagline: "Heritage Homes in Mysore",
    city: "Mysore",
    aliases: [],
    order: 13,
    category: "hotel" as const,
    limit: 12,
  },
  {
    tagline: "Coastal Villas in Kochi",
    city: "Kochi",
    aliases: [],
    order: 14,
    category: "hotel" as const,
    limit: 12,
  },
  {
    tagline: "Hospitality Hub of Hyderabad",
    city: "Hyderabad",
    aliases: [],
    order: 15,
    category: "hotel" as const,
    limit: 12,
  },
  {
    tagline: "Beachfront Stays in Pondicherry",
    city: "Pondicherry",
    aliases: [],
    order: 16,
    category: "hotel" as const,
    limit: 12,
  },
  {
    tagline: "Villas in Alibaug",
    city: "Alibaug",
    aliases: [],
    order: 17,
    category: "hotel" as const,
    limit: 12,
  },
];

export const DEFAULT_TOUR_SECTIONS = [
  {
    tagline: "Top Tour Companies in Rishikesh",
    city: "Rishikesh",
    aliases: ["Tapovan", "Laxman Jhula", "Shivpuri", "Neelkanth"],
    order: 0,
    category: "tour" as const,
    limit: 12,
  },
  {
    tagline: "Himalayan Trekking & Expeditions",
    city: "Manali",
    aliases: ["Solang", "Rohtang", "Kasol", "Spiti", "Old Manali"],
    order: 1,
    category: "tour" as const,
    limit: 12,
  },
  {
    tagline: "Scenic Tours & Nature Trails in Shimla",
    city: "Shimla",
    aliases: ["Sanjauli", "Kufri", "Chail", "Mashobra", "Narkanda"],
    order: 2,
    category: "tour" as const,
    limit: 12,
  },
  {
    tagline: "Kashmir Paradise Tours",
    city: "Srinagar",
    aliases: ["Gulmarg", "Pahalgam", "Sonamarg", "Dal Lake"],
    order: 3,
    category: "tour" as const,
    limit: 12,
  },
  {
    tagline: "Water Sports & Heritage Tours in Goa",
    city: "Goa",
    aliases: ["Calangute", "Panaji", "Baga", "Dudhsagar", "North Goa", "South Goa"],
    order: 4,
    category: "tour" as const,
    limit: 12,
  },
  {
    tagline: "Royal Heritage Walks in Jaipur",
    city: "Jaipur",
    aliases: ["Amer", "Nahargarh", "Hawa Mahal", "Old City"],
    order: 5,
    category: "tour" as const,
    limit: 12,
  },
  {
    tagline: "Palaces & Lakes of Udaipur",
    city: "Udaipur",
    aliases: ["City Palace", "Pichola", "Fateh Sagar"],
    order: 6,
    category: "tour" as const,
    limit: 12,
  },
  {
    tagline: "Wildlife Safaris in Jim Corbett",
    city: "Corbett",
    aliases: ["Ramnagar", "Dhikala", "Bijrani", "Jim Corbett"],
    order: 7,
    category: "tour" as const,
    limit: 12,
  },
  {
    tagline: "Kerala Backwaters & Tea Trails",
    city: "Munnar",
    aliases: ["Alleppey", "Kochi", "Wayanad", "Varkala"],
    order: 8,
    category: "tour" as const,
    limit: 12,
  },
  {
    tagline: "Spiritual Ghats & Ganges Boat Tours",
    city: "Varanasi",
    aliases: ["Dashashwamedh", "Assi Ghat", "Kashi"],
    order: 9,
    category: "tour" as const,
    limit: 12,
  },
];

class PopularSectionService {
  /**
   * Seed default sections if empty
   */
  async seedDefaultSectionsIfEmpty(category = "hotel") {
    const count = await PopularSection.countDocuments({ category });
    if (count === 0) {
      const templateList = category === "tour" ? DEFAULT_TOUR_SECTIONS : DEFAULT_HOTEL_SECTIONS;
      const itemsToInsert = templateList.map((sec, i) => ({
        ...sec,
        category,
        isActive: true,
        order: i,
      }));
      await PopularSection.insertMany(itemsToInsert);
    }
  }

  /**
   * Get active sections for client home carousel
   */
  async getActiveSections(category = "hotel") {
    await this.seedDefaultSectionsIfEmpty(category);
    return await PopularSection.find({ category, isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .lean();
  }

  /**
   * Get all sections for Admin Management
   */
  async getAllSectionsForAdmin(category = "hotel") {
    await this.seedDefaultSectionsIfEmpty(category);
    return await PopularSection.find({ category })
      .sort({ order: 1, createdAt: 1 })
      .lean();
  }

  /**
   * Create a new destination section
   */
  async createSection(data: Partial<IPopularSection>) {
    const category = data.category || "hotel";

    // Normalize aliases
    let aliases: string[] = [];
    if (Array.isArray(data.aliases)) {
      aliases = data.aliases
        .map((a: string) => a.trim())
        .filter(Boolean);
    } else if (typeof data.aliases === "string") {
      aliases = (data.aliases as string)
        .split(/[,/]+/)
        .map((a) => a.trim())
        .filter(Boolean);
    }

    // Auto-calculate order if not supplied
    let order = typeof data.order === "number" ? data.order : undefined;
    if (order === undefined) {
      const last = await PopularSection.findOne({ category }).sort({ order: -1 }).select("order");
      order = last && typeof last.order === "number" ? last.order + 1 : 0;
    }

    const section = new PopularSection({
      tagline: (data.tagline || "").trim(),
      city: (data.city || "").trim(),
      category,
      aliases,
      order,
      isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      limit: Number(data.limit) || 12,
    });

    return await section.save();
  }

  /**
   * Update an existing destination section
   */
  async updateSection(id: string, data: Partial<IPopularSection>) {
    const updateData: any = {};
    if (data.tagline !== undefined) updateData.tagline = data.tagline.trim();
    if (data.city !== undefined) updateData.city = data.city.trim();
    if (data.limit !== undefined) updateData.limit = Number(data.limit) || 12;
    if (data.isActive !== undefined) updateData.isActive = Boolean(data.isActive);
    if (data.order !== undefined) updateData.order = Number(data.order);

    if (data.aliases !== undefined) {
      if (Array.isArray(data.aliases)) {
        updateData.aliases = data.aliases.map((a) => a.trim()).filter(Boolean);
      } else if (typeof data.aliases === "string") {
        updateData.aliases = (data.aliases as string)
          .split(/[,/]+/)
          .map((a) => a.trim())
          .filter(Boolean);
      }
    }

    const section = await PopularSection.findByIdAndUpdate(id, updateData, { new: true });
    if (!section) throw new Error("Destination section not found");
    return section;
  }

  /**
   * Toggle active state
   */
  async toggleActive(id: string) {
    const section = await PopularSection.findById(id);
    if (!section) throw new Error("Destination section not found");
    section.isActive = !section.isActive;
    return await section.save();
  }

  /**
   * Delete destination section
   */
  async deleteSection(id: string) {
    const section = await PopularSection.findByIdAndDelete(id);
    if (!section) throw new Error("Destination section not found");
    return section;
  }

  /**
   * Reorder destination sections in bulk
   */
  async reorderSections(items: { id: string; order: number }[]) {
    const bulkOps = items.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { order: item.order } },
      },
    }));
    await PopularSection.bulkWrite(bulkOps);
    return true;
  }

  /**
   * Reset default sections
   */
  async resetDefaultSections(category = "hotel") {
    await PopularSection.deleteMany({ category });
    const templateList = category === "tour" ? DEFAULT_TOUR_SECTIONS : DEFAULT_HOTEL_SECTIONS;
    const itemsToInsert = templateList.map((sec, i) => ({
      ...sec,
      category,
      isActive: true,
      order: i,
    }));
    return await PopularSection.insertMany(itemsToInsert);
  }
}

export const popularSectionService = new PopularSectionService();
export default popularSectionService;

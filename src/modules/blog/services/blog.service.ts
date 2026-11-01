import BlogPost, { IBlogPost, BlogPostStatus } from "../models/post.model.js";
import BlogCategory from "../models/category.model.js";
import BlogTag from "../models/tag.model.js";
import BlogRevision from "../models/revision.model.js";
import BlogAuthorProfile from "../models/author.model.js";
import BlogRedirect from "../models/redirect.model.js";
import BlogPostView from "../models/view.model.js";
import slugify from "slugify";

const createSlug = (str: string) => {
  return (slugify as any).default
    ? (slugify as any).default(str, { lower: true, strict: true })
    : slugify(str, { lower: true, strict: true });
};

export const blogService = {
  // ── Public APIs ────────────────────────────────────────────────────────
  getPublicPosts: async (query: {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
    search?: string;
    featured?: boolean;
  }) => {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(50, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    const filter: any = {
      status: "PUBLISHED",
      deletedAt: null,
      $or: [
        { publishedAt: { $lte: new Date() } },
        { publishedAt: null },
      ],
    };

    if (query.featured) {
      filter.isFeatured = true;
    }

    if (query.category) {
      const cat = await BlogCategory.findOne({ slug: query.category });
      if (cat) filter.categories = cat._id;
    }

    if (query.tag) {
      const t = await BlogTag.findOne({ slug: query.tag });
      if (t) filter.tags = t._id;
    }

    if (query.search) {
      filter.$text = { $search: query.search };
    }

    const [posts, total] = await Promise.all([
      BlogPost.find(filter)
        .sort({ isFeatured: -1, publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("categories", "name slug")
        .populate("tags", "name slug")
        .populate("authorId", "firstName lastName avatar email")
        .lean(),
      BlogPost.countDocuments(filter),
    ]);

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  getPublicPostBySlug: async (slug: string) => {
    // Check if there is an active 301 redirect for this slug
    const redirect = await BlogRedirect.findOne({ oldPath: `/blog/${slug}` });
    if (redirect) {
      return { redirect: redirect.newPath, statusCode: redirect.statusCode };
    }

    const post = await BlogPost.findOne({
      slug,
      status: "PUBLISHED",
      deletedAt: null,
      $or: [
        { publishedAt: { $lte: new Date() } },
        { publishedAt: null },
      ],
    })
      .populate("categories", "name slug description")
      .populate("tags", "name slug")
      .populate("authorId", "firstName lastName avatar email")
      .lean();

    if (!post) return null;

    // Fetch author profile
    const authorProfile = await BlogAuthorProfile.findOne({
      userId: (post.authorId as any)?._id || post.authorId,
    }).lean();

    // Fetch related articles (same category)
    const relatedPosts = await BlogPost.find({
      _id: { $ne: post._id },
      status: "PUBLISHED",
      deletedAt: null,
      categories: { $in: post.categories },
    })
      .limit(3)
      .select("title slug excerpt featuredImage readingTime publishedAt")
      .lean();

    return { post, authorProfile, relatedPosts };
  },

  recordPostView: async (
    slug: string,
    meta?: { visitorId?: string; referrer?: string; source?: string }
  ) => {
    const post = await BlogPost.findOneAndUpdate(
      { slug },
      { $inc: { viewsCount: 1 } },
      { new: true }
    ).select("_id viewsCount");

    if (post) {
      await BlogPostView.create({
        postId: post._id,
        visitorId: meta?.visitorId,
        referrer: meta?.referrer,
        source: meta?.source,
      });
    }

    return post?.viewsCount || 0;
  },

  getPublicCategories: async () => {
    return BlogCategory.find().sort({ postCount: -1, name: 1 }).lean();
  },

  getPublicTags: async () => {
    return BlogTag.find().sort({ name: 1 }).lean();
  },

  getPublicAuthor: async (slug: string) => {
    const profile = await BlogAuthorProfile.findOne({ slug, isPublic: true })
      .populate("userId", "firstName lastName avatar")
      .lean();

    if (!profile) return null;

    const posts = await BlogPost.find({
      authorId: profile.userId,
      status: "PUBLISHED",
      deletedAt: null,
    })
      .sort({ publishedAt: -1 })
      .select("title slug excerpt featuredImage publishedAt readingTime")
      .lean();

    return { profile, posts };
  },

  // ── Admin CMS APIs ───────────────────────────────────────────────────────
  getAdminPosts: async (
    user: any,
    query: {
      page?: number;
      limit?: number;
      status?: string;
      category?: string;
      search?: string;
    }
  ) => {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const filter: any = { deletedAt: null };

    // RBAC: Authors only see their own articles
    if (
      user.role === "blog_author" &&
      user.role !== "admin" &&
      user.role !== "super_admin" &&
      user.role !== "blog_editor"
    ) {
      filter.authorId = user._id;
    }

    if (query.status && query.status !== "all") {
      filter.status = query.status.toUpperCase();
    }

    if (query.category && query.category !== "all") {
      filter.categories = query.category;
    }

    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: "i" } },
        { slug: { $regex: query.search, $options: "i" } },
      ];
    }

    const [posts, total, stats] = await Promise.all([
      BlogPost.find(filter)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("categories", "name slug")
        .populate("tags", "name slug")
        .populate("authorId", "firstName lastName email")
        .lean(),
      BlogPost.countDocuments(filter),
      BlogPost.aggregate([
        { $match: { deletedAt: null } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            views: { $sum: "$viewsCount" },
          },
        },
      ]),
    ]);

    const metrics = {
      total: total,
      published: stats.find((s) => s._id === "PUBLISHED")?.count || 0,
      drafts: stats.find((s) => s._id === "DRAFT")?.count || 0,
      inReview: stats.find((s) => s._id === "IN_REVIEW")?.count || 0,
      rejected: stats.find((s) => s._id === "REJECTED")?.count || 0,
      totalViews: stats.reduce((acc, curr) => acc + (curr.views || 0), 0),
    };

    return {
      posts,
      metrics,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  getAdminPostById: async (id: string) => {
    return BlogPost.findOne({ _id: id, deletedAt: null })
      .populate("categories")
      .populate("tags")
      .populate("authorId", "firstName lastName email");
  },

  createPost: async (payload: any, user: any) => {
    let slug = payload.slug ? createSlug(payload.slug) : createSlug(payload.title);

    // Ensure slug uniqueness
    const existing = await BlogPost.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const wordCount = (payload.content || "").replace(/<[^>]*>?/gm, "").split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    const post = await BlogPost.create({
      title: payload.title,
      slug,
      excerpt: payload.excerpt,
      content: payload.content,
      featuredImage: payload.featuredImage,
      imageAlt: payload.imageAlt || payload.title,
      authorId: user._id,
      status: payload.status || "DRAFT",
      readingTime,
      isFeatured: !!payload.isFeatured,
      categories: payload.categories || [],
      tags: payload.tags || [],
      seo: {
        metaTitle: payload.seo?.metaTitle || `${payload.title} | Trivllo`,
        metaDescription: payload.seo?.metaDescription || payload.excerpt,
        canonicalUrl: payload.seo?.canonicalUrl || `https://trivllo.com/blog/${slug}`,
        ogTitle: payload.seo?.ogTitle || payload.title,
        ogDescription: payload.seo?.ogDescription || payload.excerpt,
        ogImage: payload.seo?.ogImage || payload.featuredImage,
        robotsIndex: payload.seo?.robotsIndex !== false,
        robotsFollow: payload.seo?.robotsFollow !== false,
        schemaType: payload.seo?.schemaType || "BlogPosting",
      },
      publishedAt: payload.status === "PUBLISHED" ? new Date() : null,
    });

    // Create initial revision
    await BlogRevision.create({
      postId: post._id,
      editorId: user._id,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      revisionNumber: 1,
    });

    // Update category post count
    if (post.categories?.length) {
      await BlogCategory.updateMany(
        { _id: { $in: post.categories } },
        { $inc: { postCount: 1 } }
      );
    }

    return post;
  },

  updatePost: async (id: string, payload: any, user: any) => {
    const post = await BlogPost.findById(id);
    if (!post) throw new Error("Article not found");

    // If slug changed, create an automatic 301 redirect to preserve SEO rankings!
    if (payload.slug && payload.slug !== post.slug) {
      const newSlug = createSlug(payload.slug);
      await BlogRedirect.findOneAndUpdate(
        { oldPath: `/blog/${post.slug}` },
        { newPath: `/blog/${newSlug}`, statusCode: 301 },
        { upsert: true }
      );
      post.slug = newSlug;
    }

    if (payload.title) post.title = payload.title;
    if (payload.excerpt !== undefined) post.excerpt = payload.excerpt;
    if (payload.content !== undefined) {
      post.content = payload.content;
      const wordCount = post.content.replace(/<[^>]*>?/gm, "").split(/\s+/).length;
      post.readingTime = Math.max(1, Math.ceil(wordCount / 200));
    }
    if (payload.featuredImage !== undefined) post.featuredImage = payload.featuredImage;
    if (payload.imageAlt !== undefined) post.imageAlt = payload.imageAlt;
    if (payload.isFeatured !== undefined) post.isFeatured = payload.isFeatured;
    if (payload.categories) post.categories = payload.categories;
    if (payload.tags) post.tags = payload.tags;

    if (payload.seo) {
      post.seo = {
        ...post.seo,
        ...payload.seo,
      };
    }

    await post.save();

    // Log revision
    const lastRev = await BlogRevision.findOne({ postId: post._id }).sort({ revisionNumber: -1 });
    const revisionNumber = (lastRev?.revisionNumber || 0) + 1;

    await BlogRevision.create({
      postId: post._id,
      editorId: user._id,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      revisionNumber,
    });

    return post;
  },

  deletePost: async (id: string) => {
    const post = await BlogPost.findById(id);
    if (!post) throw new Error("Article not found");

    post.deletedAt = new Date();
    await post.save();

    // Decrement category count
    if (post.categories?.length) {
      await BlogCategory.updateMany(
        { _id: { $in: post.categories } },
        { $inc: { postCount: -1 } }
      );
    }

    return true;
  },

  // ── Publishing Workflow Transitions ──────────────────────────────────────
  submitForReview: async (id: string, user: any) => {
    const post = await BlogPost.findById(id);
    if (!post) throw new Error("Article not found");

    if (post.status !== "DRAFT" && post.status !== "REJECTED") {
      throw new Error(`Cannot submit article currently in ${post.status} status.`);
    }

    post.status = "IN_REVIEW";
    post.rejectionReason = undefined;
    await post.save();
    return post;
  },

  approvePost: async (id: string, user: any) => {
    const post = await BlogPost.findById(id);
    if (!post) throw new Error("Article not found");

    post.status = "PUBLISHED";
    if (!post.publishedAt) {
      post.publishedAt = new Date();
    }
    await post.save();
    return post;
  },

  rejectPost: async (id: string, user: any, reason: string) => {
    const post = await BlogPost.findById(id);
    if (!post) throw new Error("Article not found");

    post.status = "REJECTED";
    post.rejectionReason = reason || "Needs revision";
    await post.save();
    return post;
  },

  publishPost: async (id: string, scheduledAt?: Date) => {
    const post = await BlogPost.findById(id);
    if (!post) throw new Error("Article not found");

    if (scheduledAt && new Date(scheduledAt) > new Date()) {
      post.status = "PUBLISHED";
      post.scheduledAt = new Date(scheduledAt);
      post.publishedAt = new Date(scheduledAt);
    } else {
      post.status = "PUBLISHED";
      post.publishedAt = new Date();
      post.scheduledAt = null;
    }

    await post.save();
    return post;
  },

  archivePost: async (id: string) => {
    const post = await BlogPost.findById(id);
    if (!post) throw new Error("Article not found");

    post.status = "ARCHIVED";
    await post.save();
    return post;
  },

  getRevisions: async (postId: string) => {
    return BlogRevision.find({ postId })
      .populate("editorId", "firstName lastName email")
      .sort({ revisionNumber: -1 });
  },

  // ── Categories & Tags Management ─────────────────────────────────────────
  createCategory: async (data: { name: string; slug?: string; description?: string; parentId?: string }) => {
    const slug = data.slug ? createSlug(data.slug) : createSlug(data.name);
    return BlogCategory.create({
      name: data.name,
      slug,
      description: data.description,
      parentId: data.parentId || null,
    });
  },

  updateCategory: async (id: string, data: any) => {
    if (data.slug) data.slug = createSlug(data.slug);
    return BlogCategory.findByIdAndUpdate(id, data, { new: true });
  },

  deleteCategory: async (id: string) => {
    return BlogCategory.findByIdAndDelete(id);
  },

  createTag: async (name: string) => {
    const slug = createSlug(name);
    return BlogTag.findOneAndUpdate(
      { slug },
      { name, slug },
      { upsert: true, new: true }
    );
  },

  deleteTag: async (id: string) => {
    return BlogTag.findByIdAndDelete(id);
  },
};

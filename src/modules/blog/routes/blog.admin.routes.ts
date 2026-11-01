import { Router } from "express";
import {
  getAdminPosts,
  getAdminPostById,
  createPost,
  updatePost,
  deletePost,
  submitForReview,
  approvePost,
  rejectPost,
  publishPost,
  archivePost,
  getRevisions,
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAdminTags,
  createTag,
  deleteTag,
  createInvitation,
  listInvitations,
  listAuthors,
} from "../controllers/blog.admin.controller.js";
import { protect } from "../../../shared/middlewares/verifyToken.js";
import {
  requireBlogRole,
  checkArticleOwnership,
} from "../blog.middleware.js";

const router = Router();

// All routes require authenticated user with blog permissions
router.use(protect);
router.use(requireBlogRole("blog_author", "blog_editor", "seo_manager"));

// ── Posts Management ──
router.get("/posts", getAdminPosts);
router.post("/posts", createPost);
router.get("/posts/:id", getAdminPostById);
router.patch("/posts/:id", checkArticleOwnership, updatePost);
router.delete("/posts/:id", checkArticleOwnership, deletePost);

// ── Editorial Workflow Transitions ──
// Authors can submit their own draft for review
router.post("/posts/:id/submit", checkArticleOwnership, submitForReview);

// Editors and Admins only for approval, rejection, and publishing
router.post(
  "/posts/:id/approve",
  requireBlogRole("blog_editor"),
  approvePost
);
router.post(
  "/posts/:id/reject",
  requireBlogRole("blog_editor"),
  rejectPost
);
router.post(
  "/posts/:id/publish",
  requireBlogRole("blog_editor"),
  publishPost
);
router.post(
  "/posts/:id/archive",
  requireBlogRole("blog_editor"),
  archivePost
);

router.get("/posts/:id/revisions", getRevisions);

// ── Categories & Tags Management ──
router.get("/categories", getAdminCategories);
router.post(
  "/categories",
  requireBlogRole("blog_editor", "seo_manager"),
  createCategory
);
router.patch(
  "/categories/:id",
  requireBlogRole("blog_editor", "seo_manager"),
  updateCategory
);
router.delete(
  "/categories/:id",
  requireBlogRole("blog_editor", "seo_manager"),
  deleteCategory
);

router.get("/tags", getAdminTags);
router.post(
  "/tags",
  requireBlogRole("blog_editor", "seo_manager"),
  createTag
);
router.delete(
  "/tags/:id",
  requireBlogRole("blog_editor", "seo_manager"),
  deleteTag
);

// ── Writers & Invitations ──
// Only full platform Admins / Super Admins can issue invitations
router.post("/invitations", requireBlogRole(), createInvitation);
router.get("/invitations", requireBlogRole(), listInvitations);
router.get("/authors", listAuthors);

export default router;

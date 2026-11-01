import { Request, Response } from "express";
import { blogService } from "../services/blog.service.js";
import { invitationService } from "../services/invitation.service.js";
import BlogAuthorProfile from "../models/author.model.js";
import User from "../../auth/auth.model.js";

export const getAdminPosts = async (req: any, res: Response) => {
  try {
    const result = await blogService.getAdminPosts(req.user, req.query);
    res.status(200).json({
      success: true,
      data: result.posts,
      metrics: result.metrics,
      pagination: result.pagination,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to load posts",
    });
  }
};

export const getAdminPostById = async (req: Request, res: Response) => {
  try {
    const post = await blogService.getAdminPostById(req.params.id as string);
    if (!post) {
      res.status(404).json({
        success: false,
        message: "Article not found",
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch article",
    });
  }
};

export const createPost = async (req: any, res: Response) => {
  try {
    const post = await blogService.createPost(req.body, req.user);
    res.status(201).json({
      success: true,
      message: "Article created successfully",
      data: post,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create article",
    });
  }
};

export const updatePost = async (req: any, res: Response) => {
  try {
    const post = await blogService.updatePost(
      req.params.id as string,
      req.body,
      req.user
    );
    res.status(200).json({
      success: true,
      message: "Article updated successfully",
      data: post,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update article",
    });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    await blogService.deletePost(req.params.id as string);
    res.status(200).json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to delete article",
    });
  }
};

// ── Status Transition Handlers ─────────────────────────────────────────────
export const submitForReview = async (req: any, res: Response) => {
  try {
    const post = await blogService.submitForReview(
      req.params.id as string,
      req.user
    );
    res.status(200).json({
      success: true,
      message: "Article submitted for editorial review.",
      data: post,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const approvePost = async (req: any, res: Response) => {
  try {
    const post = await blogService.approvePost(
      req.params.id as string,
      req.user
    );
    res.status(200).json({
      success: true,
      message: "Article approved and published live on Trivllo!",
      data: post,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const rejectPost = async (req: any, res: Response) => {
  try {
    const { reason } = req.body;
    const post = await blogService.rejectPost(
      req.params.id as string,
      req.user,
      reason
    );
    res.status(200).json({
      success: true,
      message: "Article rejected with feedback.",
      data: post,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const publishPost = async (req: Request, res: Response) => {
  try {
    const { scheduledAt } = req.body;
    const post = await blogService.publishPost(
      req.params.id as string,
      scheduledAt
    );
    res.status(200).json({
      success: true,
      message: scheduledAt
        ? `Article scheduled to publish on ${new Date(scheduledAt).toLocaleString()}`
        : "Article published live on Trivllo!",
      data: post,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const archivePost = async (req: Request, res: Response) => {
  try {
    const post = await blogService.archivePost(req.params.id as string);
    res.status(200).json({
      success: true,
      message: "Article archived.",
      data: post,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRevisions = async (req: Request, res: Response) => {
  try {
    const revisions = await blogService.getRevisions(req.params.id as string);
    res.status(200).json({
      success: true,
      data: revisions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ── Categories & Tags ──────────────────────────────────────────────────────
export const getAdminCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await blogService.getPublicCategories();
    res.status(200).json({ success: true, data: categories });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const cat = await blogService.createCategory(req.body);
    res.status(201).json({ success: true, data: cat });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const cat = await blogService.updateCategory(
      req.params.id as string,
      req.body
    );
    res.status(200).json({ success: true, data: cat });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    await blogService.deleteCategory(req.params.id as string);
    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAdminTags = async (_req: Request, res: Response) => {
  try {
    const tags = await blogService.getPublicTags();
    res.status(200).json({ success: true, data: tags });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTag = async (req: Request, res: Response) => {
  try {
    const tag = await blogService.createTag(req.body.name);
    res.status(201).json({ success: true, data: tag });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteTag = async (req: Request, res: Response) => {
  try {
    await blogService.deleteTag(req.params.id as string);
    res.status(200).json({ success: true, message: "Tag deleted" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ── Writers & Invitations ──────────────────────────────────────────────────
export const createInvitation = async (req: any, res: Response) => {
  try {
    const { email, role } = req.body;
    if (!email || !role) {
      res.status(400).json({
        success: false,
        message: "Email and assignedRole are required",
      });
      return;
    }

    const invitation = await invitationService.createInvitation(
      email,
      role,
      req.user
    );
    res.status(201).json({
      success: true,
      message: `Invitation generated and dispatched to ${email}`,
      data: invitation,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const listInvitations = async (_req: Request, res: Response) => {
  try {
    const invitations = await invitationService.listInvitations();
    res.status(200).json({ success: true, data: invitations });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const listAuthors = async (_req: Request, res: Response) => {
  try {
    const authors = await BlogAuthorProfile.find()
      .populate("userId", "firstName lastName email role avatar")
      .lean();

    // Also include any users with blog roles who don't have a profile record yet
    const blogUsers = await User.find({
      role: {
        $in: ["blog_author", "blog_editor", "seo_manager", "super_admin", "admin"],
      },
    })
      .select("firstName lastName email role avatar")
      .lean();

    res.status(200).json({
      success: true,
      data: {
        profiles: authors,
        teamUsers: blogUsers,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

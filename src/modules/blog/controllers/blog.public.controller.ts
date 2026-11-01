import { Request, Response } from "express";
import { blogService } from "../services/blog.service.js";
import { invitationService } from "../services/invitation.service.js";

export const getPublicPosts = async (req: Request, res: Response) => {
  try {
    const result = await blogService.getPublicPosts(req.query);
    res.status(200).json({
      success: true,
      data: result.posts,
      pagination: result.pagination,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch articles",
    });
  }
};

export const getPublicPostBySlug = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const result = await blogService.getPublicPostBySlug(slug);

    if (!result) {
      res.status(404).json({
        success: false,
        message: "Article not found",
      });
      return;
    }

    if ("redirect" in result) {
      res.status(result.statusCode || 301).json({
        success: true,
        redirect: result.redirect,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: result.post,
      authorProfile: result.authorProfile,
      relatedPosts: result.relatedPosts,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch article",
    });
  }
};

export const recordPostView = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const viewsCount = await blogService.recordPostView(slug, req.body);
    res.status(200).json({
      success: true,
      viewsCount,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to record view",
    });
  }
};

export const getPublicCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await blogService.getPublicCategories();
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch categories",
    });
  }
};

export const getPublicTags = async (_req: Request, res: Response) => {
  try {
    const tags = await blogService.getPublicTags();
    res.status(200).json({
      success: true,
      data: tags,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch tags",
    });
  }
};

export const getPublicAuthor = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const result = await blogService.getPublicAuthor(slug);

    if (!result) {
      res.status(404).json({
        success: false,
        message: "Author not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: result.profile,
      posts: result.posts,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch author",
    });
  }
};

export const verifyInvitation = async (req: Request, res: Response) => {
  try {
    const token = req.query.token as string;
    if (!token) {
      res.status(400).json({ success: false, message: "Token is required" });
      return;
    }
    const data = await invitationService.verifyInvitation(token);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || "Invalid invitation" });
  }
};

export const acceptInvitation = async (req: any, res: Response) => {
  try {
    const { token, name, password } = req.body;
    if (!token) {
      res.status(400).json({
        success: false,
        message: "Invitation token is required",
      });
      return;
    }

    const result = await invitationService.acceptInvitation(token, {
      name,
      password,
    });

    res.status(200).json({
      success: true,
      message: `Invitation accepted! Role upgraded to ${result.assignedRole}.`,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Invalid invitation",
    });
  }
};

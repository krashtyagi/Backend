import { Request, Response, NextFunction } from "express";
import BlogPost from "./models/post.model.js";

export interface BlogAuthRequest extends Request {
  user?: any;
}

/**
 * Require one of the specified roles or super_admin / admin.
 */
export const requireBlogRole = (...allowedRoles: string[]) => {
  return (req: any, res: Response, next: NextFunction): void => {
    const userRole = req.user?.role;

    if (!userRole) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    // super_admin and admin have unrestricted access
    if (userRole === "super_admin" || userRole === "admin") {
      return next();
    }

    if (allowedRoles.includes(userRole)) {
      return next();
    }

    res.status(403).json({
      success: false,
      message: `Your role (${userRole}) does not have permission to perform this action.`,
    });
  };
};

/**
 * Ensure authors can only modify their own articles.
 * Admins, super_admins, and blog_editors can manage any article.
 */
export const checkArticleOwnership = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const postId = req.params.id;
    const user = req.user;

    const post = await BlogPost.findById(postId);
    if (!post) {
      res.status(404).json({
        success: false,
        message: "Article not found",
      });
      return;
    }

    // Admins and editors have full override access
    if (
      user.role === "admin" ||
      user.role === "super_admin" ||
      user.role === "blog_editor"
    ) {
      req.blogPost = post;
      return next();
    }

    // Authors can only access their own posts
    if (post.authorId.toString() !== user._id.toString()) {
      res.status(403).json({
        success: false,
        message: "Access denied. You can only edit articles created by your account.",
      });
      return;
    }

    req.blogPost = post;
    next();
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Ownership verification failed",
    });
  }
};

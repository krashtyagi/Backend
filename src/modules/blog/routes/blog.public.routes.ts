import { Router } from "express";
import {
  getPublicPosts,
  getPublicPostBySlug,
  recordPostView,
  getPublicCategories,
  getPublicTags,
  getPublicAuthor,
  verifyInvitation,
  acceptInvitation,
} from "../controllers/blog.public.controller.js";
import { optionalProtect } from "../../../shared/middlewares/verifyToken.js";

const router = Router();

router.get("/", getPublicPosts);
router.get("/categories", getPublicCategories);
router.get("/tags", getPublicTags);
router.get("/authors/:slug", getPublicAuthor);
router.get("/invitations/verify", verifyInvitation);
router.post("/invitations/accept", optionalProtect, acceptInvitation);
router.get("/:slug", getPublicPostBySlug);
router.post("/:slug/view", recordPostView);

export default router;

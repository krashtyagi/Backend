import { Router } from "express";
import { UploadController } from "./upload.controller.js";
import upload from "../../shared/utils/multer.js";

const router = Router();
const uploadController = new UploadController();

router.post(
  "/",
  upload.array("files", 10),
  uploadController.uploadMultiple,
);

router.delete("/", uploadController.deleteFile);
router.delete("/:public_id", uploadController.deleteFile);

export default router;

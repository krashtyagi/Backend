import { Request, Response, NextFunction } from "express";
import uploadService from "./upload.service.js";

export class UploadController {
  public async uploadMultiple(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.files || (req.files as any[]).length === 0) {
        res.status(400).json({ message: "No files uploaded" });
        return;
      }

      const folder = req.body.folder || "general";

      const uploadedFiles = await uploadService.uploadFiles(req.files as any, folder);

      res.status(200).json({
        success: true,
        files: uploadedFiles,
      });
    } catch (error) {
      next(error);
    }
  }

  public async deleteFile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const public_id =
        req.body.public_id ||
        req.query.public_id ||
        req.params.public_id ||
        req.params[0];
      const public_ids = req.body.public_ids;
      const resource_type =
        req.body.resource_type || req.query.resource_type || "image";

      if (Array.isArray(public_ids) && public_ids.length > 0) {
        const result = await uploadService.deleteMultipleFiles(
          public_ids,
          resource_type,
        );
        res.status(200).json({
          success: true,
          message: "Files deleted successfully",
          data: result,
        });
        return;
      }

      if (!public_id) {
        res.status(400).json({
          success: false,
          message: "public_id is required",
        });
        return;
      }

      const result = await uploadService.deleteFile(public_id, resource_type);

      res.status(200).json({
        success: true,
        message: "File deleted successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

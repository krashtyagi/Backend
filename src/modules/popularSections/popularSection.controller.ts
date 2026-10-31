import { Request, Response, NextFunction } from "express";
import popularSectionService from "./popularSection.service.js";
import logger from "../../shared/utils/logger.js";

export class PopularSectionController {
  /**
   * Get active sections (public)
   */
  async getActiveSections(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = (req.query.category as string) || "hotel";
      const sections = await popularSectionService.getActiveSections(category);
      res.status(200).json({
        success: true,
        count: sections.length,
        data: sections,
      });
    } catch (error) {
      logger.error("Controller Error: getActiveSections", error);
      next(error);
    }
  }

  /**
   * Get all sections for Admin
   */
  async getAllSections(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = (req.query.category as string) || "hotel";
      const sections = await popularSectionService.getAllSectionsForAdmin(category);
      res.status(200).json({
        success: true,
        count: sections.length,
        data: sections,
      });
    } catch (error) {
      logger.error("Controller Error: getAllSections", error);
      next(error);
    }
  }

  /**
   * Create a section (admin)
   */
  async createSection(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tagline, city, aliases, order, isActive, limit, category } = req.body;
      if (!tagline || !city) {
        res.status(400).json({
          success: false,
          message: "City and Tagline are required",
        });
        return;
      }

      const section = await popularSectionService.createSection({
        tagline,
        city,
        aliases,
        order,
        isActive,
        limit,
        category: category || "hotel",
      });

      res.status(201).json({
        success: true,
        message: "Destination section created successfully",
        data: section,
      });
    } catch (error) {
      logger.error("Controller Error: createSection", error);
      next(error);
    }
  }

  /**
   * Update a section (admin)
   */
  async updateSection(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const section = await popularSectionService.updateSection(id as string, req.body);
      res.status(200).json({
        success: true,
        message: "Destination section updated successfully",
        data: section,
      });
    } catch (error) {
      logger.error("Controller Error: updateSection", error);
      next(error);
    }
  }

  /**
   * Toggle active state (admin)
   */
  async toggleActive(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const section = await popularSectionService.toggleActive(id as string);
      res.status(200).json({
        success: true,
        message: `Section is now ${section.isActive ? "active" : "inactive"}`,
        data: section,
      });
    } catch (error) {
      logger.error("Controller Error: toggleActive", error);
      next(error);
    }
  }

  /**
   * Delete section (admin)
   */
  async deleteSection(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const section = await popularSectionService.deleteSection(id as string);
      res.status(200).json({
        success: true,
        message: "Destination section deleted successfully",
        data: section,
      });
    } catch (error) {
      logger.error("Controller Error: deleteSection", error);
      next(error);
    }
  }

  /**
   * Reorder sections (admin)
   */
  async reorderSections(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { items } = req.body;
      if (!Array.isArray(items)) {
        res.status(400).json({ success: false, message: "Invalid items array" });
        return;
      }
      await popularSectionService.reorderSections(items);
      res.status(200).json({
        success: true,
        message: "Sections reordered successfully",
      });
    } catch (error) {
      logger.error("Controller Error: reorderSections", error);
      next(error);
    }
  }

  /**
   * Reset default sections (admin)
   */
  async resetDefaults(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = (req.body.category as string) || "hotel";
      const sections = await popularSectionService.resetDefaultSections(category);
      res.status(200).json({
        success: true,
        message: "Default destination sections restored successfully",
        data: sections,
      });
    } catch (error) {
      logger.error("Controller Error: resetDefaults", error);
      next(error);
    }
  }
}

export const popularSectionController = new PopularSectionController();
export default popularSectionController;

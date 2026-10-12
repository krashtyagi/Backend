import { Request, Response, NextFunction } from "express";
import Vendor from "../vendors/vendor.model.js";
import taskService from "./task.service.js";

export class TaskController {
  public async getTasks(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const vendor = await Vendor.findOne({ userId: (req as any).user._id });
      if (!vendor) {
        res.status(404).json({ success: false, message: "Vendor profile not found" });
        return;
      }
      const result = await taskService.getTasks(vendor._id, req.query);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  public async createTask(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const vendor = await Vendor.findOne({ userId: (req as any).user._id });
      if (!vendor) {
        res.status(404).json({ success: false, message: "Vendor profile not found" });
        return;
      }
      const task = await taskService.createTask(vendor._id, req.body);
      res.status(201).json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  }

  public async updateTask(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const vendor = await Vendor.findOne({ userId: (req as any).user._id });
      if (!vendor) {
        res.status(404).json({ success: false, message: "Vendor profile not found" });
        return;
      }
      const task = await taskService.updateTask(
        req.params.id,
        vendor._id,
        req.body,
      );
      res.status(200).json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  }

  public async deleteTask(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const vendor = await Vendor.findOne({ userId: (req as any).user._id });
      if (!vendor) {
        res.status(404).json({ success: false, message: "Vendor profile not found" });
        return;
      }
      await taskService.deleteTask(req.params.id, vendor._id);
      res.status(200).json({ success: true, message: "Task deleted" });
    } catch (error) {
      next(error);
    }
  }
}

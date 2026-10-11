import { Request, Response, NextFunction } from "express";
import Vendor from "src/modules/vendors/vendor.model";
import tourService from "./tour.service";
import logger from "src/shared/utils/logger";

export class TourController {
  public async createTourCompany(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as any).user._id;

      // FIND VENDOR
      const vendor = await Vendor.findOne({ userId });

      if (!vendor) {
        throw new Error("Vendor profile not found");
      }

      const tour = await tourService.createTourCompany(req.body, vendor);

      res.status(200).json({
        success: true,
        message: "Step 4 completed successfully",
        data: {
          currentStep: vendor.currentStep,
          registrationStep: vendor.registrationStep,
          status: vendor.status,
        },
      });
    } catch (error) {
      logger.error("Controller Error: createTourCompany", error);
      next(error);
    }
  }

  public async getTourCompanies(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await tourService.getAllTourCompanies(req.query);

      res.status(200).json({
        success: true,
        count: result.companies.length,
        total: result.total,
        data: result.companies,
        page: result.page,
        limit: result.limit,
      });
    } catch (error) {
      logger.error("Controller Error: getTourCompanies", error);
      next(error);
    }
  }

  public async getTourCompanyById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const data = await tourService.getTourCompanyById(req.params.id);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      logger.error("Controller Error: getTourCompanyById", error);
      next(error);
    }
  }

  public async getTourCompaniesGroupedByCity(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const data = await tourService.getTourCompaniesGroupedByCity();

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      logger.error("Controller Error: getTourCompaniesGroupedByCity", error);
      next(error);
    }
  }

  // Get ranked tour companies for banner slideshows
  public async getRankedTourCompanies(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { rank, page, limit } = req.query;
      const result = await tourService.getRankedTourCompanies(rank, page, limit);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      logger.error("Controller Error: getRankedTourCompanies", error);
      next(error);
    }
  }
}

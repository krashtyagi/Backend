import { Request, Response } from "express";
import * as vendorAccountService from "./accountGroup.service";

export class VendorAccountGroupController {
  public async connectVendorAccounts(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const currentVendorId = (req as any).vendorId;
      const { email, password } = req.body;

      const result = await vendorAccountService.connectVendorAccounts(
        currentVendorId,
        email,
        password,
      );

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  public async getConnectedAccounts(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const currentVendorId = (req as any).vendorId;

      const accounts =
        await vendorAccountService.getConnectedAccounts(currentVendorId);

      return res.status(200).json({
        success: true,
        data: accounts,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  public async switchVendorAccount(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const currentVendorId = (req as any).vendorId;
      const { targetVendorId } = req.body;

      const result = await vendorAccountService.switchVendorAccount(
        currentVendorId,
        targetVendorId,
      );

      return res.status(200).json({
        success: true,
        message: "Account switched successfully",
        accessToken: result.accessToken,
        vendor: result.vendor,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

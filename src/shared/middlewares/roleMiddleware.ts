import { Request, Response, NextFunction, RequestHandler } from "express";

// Extend Express Request interface if not already defined globally in your project
export interface AuthenticatedRequest extends Request {
  user?: {
    role: string;
    [key: string]: any;
  };
}

export const authorize = (...roles: string[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthenticatedRequest;
    const userRole = authReq.user?.role;

    const isAuthorized =
      !!userRole &&
      (userRole === "super_admin" ||
        roles.includes(userRole) ||
        (roles.includes("admin") && (userRole === "admin" || userRole === "super_admin")));

    if (!isAuthorized) {
      res.status(403).json({
        message: `Role (${userRole || "unknown"}) is not allowed to access this resource`,
      });
      return;
    }

    next();
  };
};

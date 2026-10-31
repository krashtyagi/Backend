import { Router } from "express";
import { popularSectionController } from "./popularSection.controller.js";
import { protect } from "../../shared/middlewares/verifyToken.js";
import { authorize } from "../../shared/middlewares/roleMiddleware.js";

const router = Router();

// Root handler: returns all if accessed under /admin, or active if accessed under public route
router.get("/", (req, res, next) => {
  if (req.baseUrl.includes("/admin")) {
    return (protect as any)(req, res, () => {
      return (authorize("admin") as any)(req, res, () => {
        return popularSectionController.getAllSections(req, res, next);
      });
    });
  }
  return popularSectionController.getActiveSections(req, res, next);
});

router.get("/active", popularSectionController.getActiveSections);
router.get("/all", protect, authorize("admin"), popularSectionController.getAllSections);

router.post("/", protect, authorize("admin"), popularSectionController.createSection);
router.put("/:id", protect, authorize("admin"), popularSectionController.updateSection);
router.patch("/:id/toggle-active", protect, authorize("admin"), popularSectionController.toggleActive);
router.delete("/:id", protect, authorize("admin"), popularSectionController.deleteSection);
router.post("/reorder", protect, authorize("admin"), popularSectionController.reorderSections);
router.post("/reset-defaults", protect, authorize("admin"), popularSectionController.resetDefaults);

export default router;

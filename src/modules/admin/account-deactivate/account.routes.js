const express = require("express");
const router = express.Router();

const accountController = require("./account.controller");
const { protect } = require("../../../shared/middlewares/verifyToken");
const { authorize } = require("../../../shared/middlewares/roleMiddleware");

router.get(
  "/delete-requests",
  protect,
  authorize("admin"),
  accountController.getDeleteRequests,
);

router.patch(
  "/:userId/approve-delete",
  protect,
  authorize("admin"),
  accountController.approveDeleteRequest,
);

router.patch(
  "/:userId/reject-delete",
  protect,
  authorize("admin"),
  accountController.rejectDeleteRequest,
);

module.exports = router;

const express = require("express");
const upload = require("../../shared/utils/multer");
const uploadController = require("./upload.controller");

const router = express.Router();

router.post(
  "/",
  upload.array("files", 10),
  uploadController.uploadMultiple
);

router.delete("/:public_id", uploadController.deleteFile);

module.exports = router;

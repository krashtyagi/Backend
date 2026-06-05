const uploadService = require("./upload.service");

exports.uploadMultiple = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const folder = req.body.folder || "general";

    const uploadedFiles = await uploadService.uploadFiles(
      req.files,
      folder
    );

    res.status(200).json({
      success: true,
      files: uploadedFiles,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteFile = async (req, res, next) => {
  try {
    const { public_id } = req.params;

    await uploadService.deleteFile(public_id);

    res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

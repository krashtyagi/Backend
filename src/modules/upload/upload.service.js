const cloudinary = require("../../shared/config/cloudinary");

exports.uploadFiles = async (files, folder = "general") => {
  try {
    const results = await Promise.all(
      files.map((file) => {
        const isImage = file.mimetype.startsWith("image");

        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder,
              resource_type: "auto",

              ...(isImage && {
                format: "webp", // force webp
                quality: "auto",
              }),
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            },
          );

          stream.end(file.buffer);
        });
      }),
    );

    return results.map((file) => ({
      url: file.secure_url,
      public_id: file.public_id,
      resource_type: file.resource_type,
      format: file.format,
    }));
  } catch (error) {
    throw error;
  }
};

exports.deleteFile = async (publicId, resourceType = "image") => {
  if (!publicId) return { result: "ok" };
  try {
    const resType = resourceType === "raw" || resourceType === "video" ? resourceType : "image";
    let res = await cloudinary.uploader.destroy(publicId, {
      resource_type: resType,
    });
    
    // Fallback: if not found under specified type, try raw or image
    if (res.result === "not found") {
      const fallbackType = resType === "image" ? "raw" : "image";
      res = await cloudinary.uploader.destroy(publicId, {
        resource_type: fallbackType,
      });
    }
    return res;
  } catch (error) {
    console.error("Cloudinary deleteFile error for", publicId, error);
    return { result: "error", error: error.message };
  }
};

exports.deleteMultipleFiles = async (publicIds = [], resourceType = "image") => {
  if (!Array.isArray(publicIds) || publicIds.length === 0) {
    return { success: true, count: 0 };
  }

  const results = await Promise.allSettled(
    publicIds.filter(Boolean).map((id) => exports.deleteFile(id, resourceType))
  );

  return {
    success: true,
    count: results.length,
    results,
  };
};

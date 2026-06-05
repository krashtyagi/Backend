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

exports.deleteFile = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });
};

import cloudinary from "../../shared/config/cloudinary.js";

export const uploadFiles = async (files: any[], folder: string = "general") => {
  try {
    const results = await Promise.all(
      files.map((file: any) => {
        const isImage = file.mimetype?.startsWith("image");

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
            (error: any, result: any) => {
              if (error) return reject(error);
              resolve(result);
            },
          );

          stream.end(file.buffer);
        });
      }),
    );

    return results.map((file: any) => ({
      url: file.secure_url,
      public_id: file.public_id,
      resource_type: file.resource_type,
      format: file.format,
    }));
  } catch (error) {
    throw error;
  }
};

export const deleteFile = async (publicId: string, resourceType: string = "image") => {
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
  } catch (error: any) {
    console.error("Cloudinary deleteFile error for", publicId, error);
    return { result: "error", error: error.message };
  }
};

export const deleteMultipleFiles = async (publicIds: string[] = [], resourceType: string = "image") => {
  if (!Array.isArray(publicIds) || publicIds.length === 0) {
    return { success: true, count: 0 };
  }

  const results = await Promise.allSettled(
    publicIds.filter(Boolean).map((id: string) => deleteFile(id, resourceType))
  );

  return {
    success: true,
    count: results.length,
    results,
  };
};

export class UploadService {
  async uploadFiles(files: any[], folder: string = "general") {
    return uploadFiles(files, folder);
  }

  async deleteFile(publicId: string, resourceType: string = "image") {
    return deleteFile(publicId, resourceType);
  }

  async deleteMultipleFiles(publicIds: string[] = [], resourceType: string = "image") {
    return deleteMultipleFiles(publicIds, resourceType);
  }
}

export const uploadService = new UploadService();

export default uploadService;


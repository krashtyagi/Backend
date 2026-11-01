import { google } from "googleapis";
import path from "path";
import fs from "fs";
import logger from "../utils/logger.js";

const SCOPES = ["https://www.googleapis.com/auth/indexing"];

const getKeyFilePath = () => {
  const directPath = path.resolve(
    process.cwd(),
    "src/shared/config/google-indexing-key.json"
  );
  if (fs.existsSync(directPath)) return directPath;
  const altPath = path.resolve(
    process.cwd(),
    "backend/src/shared/config/google-indexing-key.json"
  );
  if (fs.existsSync(altPath)) return altPath;
  return "./src/shared/config/google-indexing-key.json";
};

export const googleIndexingService = {
  /**
   * Notify Googlebot that a URL has been created or updated.
   * @param url Full canonical URL (e.g. https://trivllo.com/blog/best-hotels-in-indore)
   */
  notifyUrlUpdate: async (url: string) => {
    try {
      const keyFile = getKeyFilePath();
      if (!fs.existsSync(keyFile)) {
        logger.warn(
          `[Google Indexing API] Keyfile not found at ${keyFile}. Skipping ping.`
        );
        return;
      }

      const auth = new google.auth.GoogleAuth({
        keyFile,
        scopes: SCOPES,
      });

      const client = await auth.getClient();
      const indexing = google.indexing({ version: "v3", auth: client as any });

      const res = await indexing.urlNotifications.publish({
        requestBody: {
          url,
          type: "URL_UPDATED",
        },
      });

      logger.info(
        `[Google Indexing API] Pinged update for: ${url} (Status: ${res.status})`,
      );
      return res.data;
    } catch (error: any) {
      logger.error(
        `[Google Indexing API Error] Failed for ${url}: ${error.message}`,
      );
    }
  },

  /**
   * Notify Googlebot that a URL has been deleted / archived.
   */
  notifyUrlDelete: async (url: string) => {
    try {
      const keyFile = getKeyFilePath();
      if (!fs.existsSync(keyFile)) {
        logger.warn(
          `[Google Indexing API] Keyfile not found at ${keyFile}. Skipping ping.`
        );
        return;
      }

      const auth = new google.auth.GoogleAuth({
        keyFile,
        scopes: SCOPES,
      });

      const client = await auth.getClient();
      const indexing = google.indexing({ version: "v3", auth: client as any });

      const res = await indexing.urlNotifications.publish({
        requestBody: {
          url,
          type: "URL_DELETED",
        },
      });

      logger.info(`[Google Indexing API] Pinged deletion for: ${url}`);
      return res.data;
    } catch (error: any) {
      logger.error(
        `[Google Indexing API Error] Deletion ping failed for ${url}: ${error.message}`,
      );
    }
  },
};

import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// ES modules doesn't support __dirname directly
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define base public path (e.g. /public)
const publicBasePath = path.resolve(__dirname, "../public");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folderPath;

    // Route based on field name
    switch (file.fieldname) {
      case "albumImage":
      case "songImage":
        folderPath = path.join(publicBasePath, "cover-images");
        break;
      case "audioFile":
        folderPath = path.join(publicBasePath, "songs");
        break;
      default:
        folderPath = path.join(publicBasePath, "uploads");
    }

    // Ensure directory exists
    fs.mkdir(folderPath, { recursive: true }, (err) => {
      if (err) {
        console.error("Failed to create directory:", err);
        return cb(err);
      }
      cb(null, folderPath);
    });
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${file.fieldname}-${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const isImage = file.mimetype.startsWith("image/");
  const isAudio = file.mimetype.startsWith("audio/");
  if (isImage || isAudio) {
    cb(null, true);
  } else {
    cb(new Error("Only image and audio files are allowed."), false);
  }
};

// Multer upload instance
const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // Max 200MB
  fileFilter,
});

/**
 * Upload multiple fields in a single form submission.
 * Example usage in route:
 *   fields([
 *     { name: 'songImage', maxCount: 1 },
 *     { name: 'audioFile', maxCount: 1 }
 *   ])
 */
export const fields = (fieldsArray) => upload.fields(fieldsArray);

/**
 * Upload a single file for general usage.
 * Example: single("profilePicture")
 */
export const single = (fieldName) => upload.single(fieldName);

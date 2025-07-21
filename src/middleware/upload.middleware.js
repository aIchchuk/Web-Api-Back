import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Point to backend's public folder
const publicBasePath = path.resolve(__dirname, "../public");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folderPath;

    if (file.fieldname === "songImage") {
      folderPath = path.join(publicBasePath, "cover-images");
    } else if (file.fieldname === "audioFile") {
      folderPath = path.join(publicBasePath, "songs");
    } else {
      folderPath = path.join(publicBasePath, "uploads");
    }

    fs.mkdir(folderPath, { recursive: true }, (err) => {
      if (err) {
        console.error("Failed to create directory", err);
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
    cb(new Error("Only image and audio files are allowed"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter,
});

export const fields = (fieldsArray) => upload.fields(fieldsArray);

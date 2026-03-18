import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDirectory = path.join(__dirname, "..", "uploads", "products");
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, uploadDirectory);
  },
  filename: function (req, file, callback) {
    const extension = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extension).replace(/\s+/g, "-");
    callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}-${basename}${extension}`);
  },
});

const upload = multer({ storage });

export default upload;

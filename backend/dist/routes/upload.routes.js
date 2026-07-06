import { Router } from "express";
import multer from "multer";
import { uploadImage } from "../controllers/upload.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { isAdminMiddleware } from "../middlewares/isAdmin.middleware.js";
export const uploadRouter = Router();
// Konfigurasi multer menggunakan memoryStorage
// (file akan disimpan dalam buffer RAM sementara sebelum diunggah ke Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Maksimal 5 MB
    },
    fileFilter: (req, file, cb) => {
        // Hanya izinkan tipe gambar
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        }
        else {
            cb(new Error("Hanya file gambar yang diizinkan"));
        }
    },
});
uploadRouter.post("/image", authMiddleware, isAdminMiddleware, upload.single("image"), uploadImage);
//# sourceMappingURL=upload.routes.js.map
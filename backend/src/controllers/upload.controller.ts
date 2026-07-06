import type { Request, Response, NextFunction } from "express";
import { cloudinary } from "../configs/cloudinary.config.js";
import { StatusCodes } from "http-status-codes";

export const uploadImage = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		if (!req.file) {
			res.status(StatusCodes.BAD_REQUEST).json({
				errors: "Tidak ada file yang diunggah",
			});
			return;
		}

		// Karena kita menggunakan multer memoryStorage, file ada di req.file.buffer
		// Kita perlu mengonversinya ke stream agar bisa di-upload ke Cloudinary
		const uploadStream = cloudinary.uploader.upload_stream(
			{
				folder: "netquest", // Folder di Cloudinary
				resource_type: "image",
			},
			(error, result) => {
				if (error) {
					console.error("Cloudinary Upload Error:", error);
					res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
						errors: "Gagal mengunggah gambar ke server cloud",
					});
					return;
				}

				if (result) {
					res.status(StatusCodes.OK).json({
						data: {
							url: result.secure_url,
							publicId: result.public_id,
						},
					});
					return;
				}
			},
		);

		// Menyalurkan (pipe) buffer dari multer ke stream cloudinary
		uploadStream.end(req.file.buffer);
	} catch (error) {
		next(error);
	}
};

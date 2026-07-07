import type { Request, Response, NextFunction } from "express";
import { cloudinary } from "../configs/cloudinary.config.js";
import { StatusCodes } from "http-status-codes";
import crypto from "crypto";

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

		// Hitung hash (sidik jari unik) dari isi file untuk mencegah duplikasi di Cloudinary
		const fileHash = crypto.createHash('md5').update(req.file.buffer).digest('hex');

		// Karena kita menggunakan multer memoryStorage, file ada di req.file.buffer
		// Kita perlu mengonversinya ke stream agar bisa di-upload ke Cloudinary
		const uploadStream = cloudinary.uploader.upload_stream(
			{
				folder: "netquest", // Folder di Cloudinary
				resource_type: "image",
				public_id: fileHash, // Gunakan hash sebagai nama unik file
				overwrite: true,     // Jika hash sama, timpa gambar lama
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

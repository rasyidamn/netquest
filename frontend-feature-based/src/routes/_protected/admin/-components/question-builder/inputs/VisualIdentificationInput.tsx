import React, { useState, useRef } from "react";
import { useWatch } from "react-hook-form";
import { Loader2, Image as ImageIcon, MapPin, X, CheckCircle2 } from "lucide-react";
import { uploadApi } from "@/core/api/upload.api";
import toast from "react-hot-toast";

interface VisualIdentificationInputProps {
	setValue: any;
	control: any;
	errors: any;
}

export const VisualIdentificationInput = ({
	setValue,
	control,
	errors,
}: VisualIdentificationInputProps) => {
	const baseImageUrl = useWatch({ control, name: "baseImageUrl" });
	const hotspots = useWatch({ control, name: "hotspots" }) || [];
	const [isUploading, setIsUploading] = useState(false);
	const imgRef = useRef<HTMLImageElement>(null);

	const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		try {
			setIsUploading(true);
			const url = await uploadApi.uploadImage(file);
			setValue("baseImageUrl", url);
			// Reset hotspots when new image is uploaded
			setValue("hotspots", []);
			toast.success("Gambar utama berhasil diunggah!");
		} catch (error) {
			toast.error("Gagal mengunggah gambar");
		} finally {
			setIsUploading(false);
			e.target.value = "";
		}
	};

	const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
		if (!imgRef.current) return;
		const rect = imgRef.current.getBoundingClientRect();
		const x = ((e.clientX - rect.left) / rect.width) * 100;
		const y = ((e.clientY - rect.top) / rect.height) * 100;

		const newHotspot = {
			id: `hotspot-${Date.now()}`, // Temporary ID for new ones
			x,
			y,
			isCorrect: hotspots.length === 0, // First one is correct by default
		};
		
		setValue("hotspots", [...hotspots, newHotspot]);
	};

	const removeHotspot = (index: number) => {
		const newHotspots = [...hotspots];
		newHotspots.splice(index, 1);
		
		// If we removed the correct one and there are others, make the first one correct
		if (hotspots[index].isCorrect && newHotspots.length > 0) {
			newHotspots[0].isCorrect = true;
		}
		
		setValue("hotspots", newHotspots);
	};

	const setCorrectHotspot = (index: number) => {
		const newHotspots = hotspots.map((h: any, i: number) => ({
			...h,
			isCorrect: i === index,
		}));
		setValue("hotspots", newHotspots);
	};

	return (
		<div className="space-y-6 bg-base-200/30 p-5 rounded-xl border border-base-200">
			<div>
				<div className="flex justify-between items-center mb-2">
					<div>
						<span className="text-sm font-bold text-base-content/80 block">
							1. Gambar Utama
						</span>
						<p className="text-xs text-base-content/50">
							Unggah gambar yang akan menjadi kanvas kuis.
						</p>
					</div>
					<label className="btn btn-sm btn-primary cursor-pointer">
						{isUploading ? (
							<Loader2 className="w-4 h-4 animate-spin" />
						) : (
							<ImageIcon className="w-4 h-4" />
						)}
						{baseImageUrl ? "Ganti Gambar" : "Unggah Gambar"}
						<input
							type="file"
							accept="image/*"
							className="hidden"
							onChange={handleUpload}
							disabled={isUploading}
						/>
					</label>
				</div>
				{errors.baseImageUrl && (
					<span className="text-error text-xs">{errors.baseImageUrl.message}</span>
				)}
			</div>

			{baseImageUrl && (
				<div className="space-y-4">
					<div>
						<span className="text-sm font-bold text-base-content/80 block mb-1">
							2. Tentukan Titik Hotspot (Marker)
						</span>
						<p className="text-xs text-base-content/50 mb-3">
							Klik pada area manapun di gambar untuk menambahkan titik. Titik hijau adalah jawaban benar.
						</p>
						
						<div className="relative inline-block border-2 border-base-300 rounded-lg overflow-hidden bg-base-100 max-w-full">
							<img
								ref={imgRef}
								src={baseImageUrl}
								alt="Base Canvas"
								onClick={handleImageClick}
								className="max-w-full max-h-[400px] object-contain cursor-crosshair"
								draggable={false}
							/>
							
							{/* Markers */}
							{hotspots.map((hotspot: any, index: number) => (
								<div
									key={index}
									className={`absolute w-6 h-6 -ml-3 -mt-3 rounded-full border-2 shadow-sm flex items-center justify-center cursor-pointer transition-colors ${
										hotspot.isCorrect 
											? "bg-success text-success-content border-white" 
											: "bg-error text-error-content border-white opacity-80 hover:opacity-100"
									}`}
									style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
									onClick={(e) => {
										e.stopPropagation();
										setCorrectHotspot(index);
									}}
								>
									<span className="text-[10px] font-bold">{index + 1}</span>
								</div>
							))}
						</div>
						{errors.hotspots && (
							<span className="text-error text-xs block mt-1">{errors.hotspots.message}</span>
						)}
					</div>

					{hotspots.length > 0 && (
						<div>
							<span className="text-sm font-bold text-base-content/80 block mb-2">
								Daftar Titik (Pilih Jawaban Benar)
							</span>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
								{hotspots.map((hotspot: any, index: number) => (
									<div 
										key={index} 
										className={`flex items-center gap-2 p-2 rounded-lg border ${
											hotspot.isCorrect ? "bg-success/10 border-success/30" : "bg-base-100 border-base-200"
										}`}
									>
										<div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
											hotspot.isCorrect ? "bg-success" : "bg-error"
										}`}>
											{index + 1}
										</div>
										<div className="flex-1 text-xs font-mono">
											X: {hotspot.x.toFixed(1)}%, Y: {hotspot.y.toFixed(1)}%
										</div>
										{!hotspot.isCorrect && (
											<button
												type="button"
												className="btn btn-xs btn-ghost text-success"
												onClick={() => setCorrectHotspot(index)}
												title="Jadikan Benar"
											>
												<CheckCircle2 className="w-4 h-4" />
											</button>
										)}
										<button
											type="button"
											className="btn btn-xs btn-ghost text-error"
											onClick={() => removeHotspot(index)}
										>
											<X className="w-4 h-4" />
										</button>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

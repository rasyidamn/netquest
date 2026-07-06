import { apiClient } from "./apiClient";

interface UploadResponse {
	data: {
		url: string;
		publicId: string;
	};
}

export const uploadApi = {
	uploadImage: async (file: File): Promise<string> => {
		const formData = new FormData();
		formData.append("image", file);

		const response = await apiClient.post<UploadResponse>("/upload/image", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		return response.data.data.url;
	},
};

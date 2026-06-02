import jwt from "jsonwebtoken";
import type { StringValue } from "ms";

export interface JwtPayload {
	id: string;
	nim: string;
	role: string;
}
export const generateToken = (payload: JwtPayload) => {
	const jwtSecret = process.env.JWT_SECRET;
	const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

	if (!jwtSecret) {
		throw new Error("FATAL ERROR: JWT_SECRET belum diatur di file .env");
	}

	const token = jwt.sign(payload, jwtSecret as string, {
		expiresIn: jwtExpiresIn as StringValue,
	});

	return token;
};

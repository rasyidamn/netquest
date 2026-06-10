import jwt from "jsonwebtoken";
export const generateToken = (payload) => {
    const jwtSecret = process.env.JWT_SECRET;
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN;
    if (!jwtSecret) {
        throw new Error("FATAL ERROR: JWT_SECRET belum diatur di file .env");
    }
    const token = jwt.sign(payload, jwtSecret, {
        expiresIn: jwtExpiresIn,
    });
    return token;
};
//# sourceMappingURL=generateJWT.util.js.map
import { success } from "zod";
export const sendSuccess = (res, statusCode, message, data) => {
    const responsePayload = {
        success: true,
        message,
        data,
    };
    return res.status(statusCode).json(responsePayload);
};
export const sendError = (res, statusCode, message, errors) => {
    const responsePayload = {
        success: false,
        message,
        errors,
    };
    return res.status(statusCode).json(responsePayload);
};
//# sourceMappingURL=response-formatter.util.js.map
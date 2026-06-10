import logger from "../utils/logger.util.js";
export const requestLogger = (req, res, next) => {
    // Catat waktu mulai (dalam milidetik)
    const start = Date.now();
    // Event 'finish' akan otomatis terpanggil oleh Express
    // TEPAT SETELAH response berhasil dikirim ke frontend
    res.on("finish", () => {
        const duration = Date.now() - start;
        const { method, originalUrl } = req;
        const { statusCode } = res;
        // Format pesan yang akan ditampilkan
        const logMessage = `[${method}] ${originalUrl} - Status: ${statusCode} - Duration: ${duration}ms`;
        // Warnai log berdasarkan status code HTTP
        if (statusCode >= 500) {
            logger.error(logMessage);
        }
        else if (statusCode >= 400) {
            logger.warn(logMessage); // 400 Bad Request, 401 Unauthorized, dll
        }
        else {
            logger.info(logMessage); // 200 OK, 201 Created
        }
    });
    // Lanjutkan ke middleware/controller berikutnya
    next();
};
//# sourceMappingURL=request-logger.middleware.js.map
import winston from "winston";
// Format khusus terminal: Berwarna dan mudah dibaca
const consoleFormat = winston.format.combine(winston.format.colorize(), winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston.format.errors({ stack: true }), // Tetap tangkap detail error
winston.format.printf(({ level, message, timestamp, stack }) => {
    // Jika ada error stack (jejak kode), tampilkan stack-nya. Jika tidak, tampilkan pesan biasa.
    return `[${timestamp}] ${level}: ${stack || message}`;
}));
const logger = winston.createLogger({
    // Level "debug" akan menampilkan semua jenis log (error, warn, info, debug)
    level: "debug",
    format: consoleFormat,
    transports: [
        // Satu-satunya transport di sini adalah layar terminal Anda
        new winston.transports.Console()
    ],
});
export default logger;
//# sourceMappingURL=logger.util.js.map
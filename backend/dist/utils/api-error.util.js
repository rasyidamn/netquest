export class ApiError extends Error {
    status;
    message;
    constructor(status, message) {
        super(message);
        this.status = status;
        this.message = message;
    }
}
//# sourceMappingURL=api-error.util.js.map
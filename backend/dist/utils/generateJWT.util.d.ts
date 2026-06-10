export interface JwtPayload {
    id: string;
    nim: string;
    role: string;
}
export declare const generateToken: (payload: JwtPayload) => string;
//# sourceMappingURL=generateJWT.util.d.ts.map
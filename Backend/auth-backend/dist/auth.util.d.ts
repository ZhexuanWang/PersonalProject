export type JwtPayload = {
    sub: string;
    email: string;
};
export declare const signAccessToken: (userId: string, email: string) => string;
export declare const signRefreshToken: (userId: string, email: string) => string;
export declare const verifyAccessToken: (token: string) => JwtPayload;
export declare const verifyRefreshToken: (token: string) => JwtPayload;
//# sourceMappingURL=auth.util.d.ts.map
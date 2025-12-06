type User = {
    id: string;
    email: string;
    password_hash: string;
};
export declare function findUserByEmail(email: string): Promise<User | undefined>;
export declare function createUser(user: Omit<User, "id">): Promise<User>;
export declare function findUserById(id: string): Promise<User | undefined>;
export {};
//# sourceMappingURL=db.d.ts.map
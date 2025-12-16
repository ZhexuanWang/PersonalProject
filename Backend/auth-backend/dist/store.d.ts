export type User = {
    id: string;
    email: string;
    name?: string;
    passwordHash?: string;
    googleLinked: boolean;
};
export declare const findUserByEmail: (email: string) => User | undefined;
export declare const findUserById: (id: string) => User | undefined;
export declare const createUser: (user: User) => User;
export declare const updateUser: (id: string, patch: Partial<User>) => User | undefined;
//# sourceMappingURL=store.d.ts.map
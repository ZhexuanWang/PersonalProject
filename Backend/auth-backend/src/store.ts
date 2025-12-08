// src/store.ts
export type User = {
    id: string;
    email: string;
    name?: string;
    passwordHash?: string;       // present if user set a password
    googleLinked: boolean;       // true if created via Google
};

const users = new Map<string, User>();

export const findUserByEmail = (email: string) => [...users.values()].find(u => u.email === email);
export const findUserById = (id: string) => users.get(id);
export const createUser = (user: User) => { users.set(user.id, user); return user; };
export const updateUser = (id: string, patch: Partial<User>): User | undefined => {
    const u = users.get(id);
    if (!u) return undefined;
    const nu: User = { ...u, ...patch };
    users.set(id, nu);
    return nu;
};


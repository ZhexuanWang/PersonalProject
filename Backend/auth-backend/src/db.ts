type User = { id: string; email: string; password_hash: string };
const users: User[] = [];

export async function findUserByEmail(email: string): Promise<User | undefined> {
    return users.find(u => u.email === email);
}

export async function createUser(user: Omit<User, "id">): Promise<User> {
    const newUser = { ...user, id: String(users.length + 1) };
    users.push(newUser);
    return newUser;
}

export async function findUserById(id: string): Promise<User | undefined> {
    return users.find(u => u.id === id);
}

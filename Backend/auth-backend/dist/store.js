"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.createUser = exports.findUserById = exports.findUserByEmail = void 0;
const users = new Map();
const findUserByEmail = (email) => [...users.values()].find(u => u.email === email);
exports.findUserByEmail = findUserByEmail;
const findUserById = (id) => users.get(id);
exports.findUserById = findUserById;
const createUser = (user) => { users.set(user.id, user); return user; };
exports.createUser = createUser;
const updateUser = (id, patch) => {
    const u = users.get(id);
    if (!u)
        return undefined;
    const nu = { ...u, ...patch };
    users.set(id, nu);
    return nu;
};
exports.updateUser = updateUser;
//# sourceMappingURL=store.js.map
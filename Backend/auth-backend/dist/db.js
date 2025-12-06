"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByEmail = findUserByEmail;
exports.createUser = createUser;
exports.findUserById = findUserById;
const users = [];
async function findUserByEmail(email) {
    return users.find(u => u.email === email);
}
async function createUser(user) {
    const newUser = { ...user, id: String(users.length + 1) };
    users.push(newUser);
    return newUser;
}
async function findUserById(id) {
    return users.find(u => u.id === id);
}
//# sourceMappingURL=db.js.map
import { IUser } from "../models/IUser";
import BaseService from "./base-service";

class UserService extends BaseService {
    async getByToken() {
        return this.api.get("/users/me");
    }
    async getAll() {
        return this.api.get("/users/");
    }
    async deleteByLogin(login: string) {
        return this.api.delete(`/users/${login}`);
    }
    async updateByLogin(dto: IUser) {
        return this.api.put("/users/", dto);
    }
    async deleteById(id: string) {
        return this.api.delete(`/users/${id}`);
    }

    async changePassword(id: string, password: string) {
        return this.api.put("/users/change-password", { password, id });
    }
    async deactivate(id: string) {
        return this.api.patch(`/users/${id}/deactivate`);
    }
    async activate(id: string) {
        return this.api.patch(`/users/${id}/activate`);
    }
}

export default function init() {
    return new UserService();
}

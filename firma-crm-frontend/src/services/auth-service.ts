import BaseService from "./base-service";

export interface loginErrorResponse {
    message: string;
}

export interface loginResponse {
    accessToken: string;
    refreshToken: string;
}

export interface loginDto {
    login: string;
    password: string;
}

export interface RegistrationDto {
    login: string;
    password: string;
    tag: string;
    roles: string[];
}

class AuthService extends BaseService {
    async login(dto: loginDto) {
        return this.api.post("/auth/login", { ...dto });
    }
    async logout() {
        return this.api.get("/auth/logout");
    }
    async registration(dto: RegistrationDto) {
        return this.api.post("/auth/register", dto);
    }
}

export default function init() {
    return new AuthService();
}

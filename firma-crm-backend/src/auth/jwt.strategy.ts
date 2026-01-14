import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "../users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly users: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET || "dev_secret_change_me",
        });
    }

    async validate(payload: { sub: string }) {
        const user = await this.users.findByIdWithRoles(payload.sub);
        if (!user) throw new UnauthorizedException();
        return user;
    }
}

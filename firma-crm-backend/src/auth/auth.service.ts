import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto/auth.dto";
import { User } from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) { }

  async login(dto: LoginDto | any) {
    const email = dto?.email ?? dto?.login; // ✅ поддержка старого фронта

    if (!email || !dto?.password) {
      throw new BadRequestException("email/login and password are required");
    }

    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) throw new UnauthorizedException("Invalid credentials");

    if (user.isActive === false) {
      throw new UnauthorizedException("User is deactivated");
    }

    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles.map((r) => r.role.name),
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: payload.roles,
        // rolesFlat: payload.roles,    // string[]
      },
    };
  }

  async validateUser(id: string) {
    return this.usersService.findByIdWithRoles(id);
  }

  private async issueTokens(payload: { sub: string; email: string; roles: string[] }) {
    const accessToken = await this.jwtService.signAsync(payload, { expiresIn: "1h" });
    const refreshToken = await this.jwtService.signAsync(payload, { expiresIn: "7d" });
    return { accessToken, refreshToken };
  }





  async register(dto: AuthDto) {
    const email = (dto.email ?? dto.login)?.trim().toLowerCase();
    const name = (dto.name ?? dto.tag)?.trim();

    if (!email || !dto.password) {
      throw new BadRequestException("email/login and password are required");
    }

    const oldUser = await this.prisma.user.findUnique({ where: { email } });
    if (oldUser) throw new BadRequestException("User already exists");

    const passwordHash = await bcrypt.hash(dto.password, 10);

    // роли из запроса или дефолт DEALER
    const roleNames = (dto.roles?.length ? dto.roles : ["DEALER"])
      .map((r) => String(r).trim().toUpperCase());

    // создаем роли если их нет
    const roleRecords = await Promise.all(
      roleNames.map((roleName) =>
        this.prisma.role.upsert({
          where: { name: roleName },
          update: {},
          create: { name: roleName },
        })
      )
    );

    // ✅ если роль DEALER — создаём/находим Dealer и привязываем к User
    let dealerId: string | null = null;

    const isDealer = roleNames.includes("DEALER");
    if (isDealer) {
      const dealerName = (dto.tag ?? dto.name ?? dto.login ?? dto.email)?.trim();
      if (!dealerName) {
        throw new BadRequestException("Dealer must have tag/name");
      }

      const dealer = await this.prisma.dealer.upsert({
        where: { name: dealerName },
        update: {},
        create: { name: dealerName },
      });

      dealerId = dealer.id;
    }

    const user = await this.prisma.user.create({
      data: {
        name: name ?? undefined,
        email,
        passwordHash,
        dealerId: dealerId ?? undefined, // ✅ ВАЖНО: записали dealerId
        roles: {
          create: roleRecords.map((role) => ({
            role: { connect: { id: role.id } },
          })),
        },
      },
      include: { roles: { include: { role: true } }, dealer: true },
    });

    const roles = user.roles.map((r) => r.role.name);

    const payload = { sub: user.id, email: user.email, roles };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles,
        dealerId: user.dealerId ?? null,
        dealerName: user.dealer?.name ?? null,
      },
    };
  }
}

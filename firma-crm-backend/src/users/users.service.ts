import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { returnUserObject } from "./return-user.object";
import { Prisma } from "@prisma/client";
import * as bcrypt from 'bcrypt'
import { AdminChangePasswordDto } from "./dto/admin-change-password.dto";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { roles: { include: { role: true } } },
    });
  }

  async findByIdWithRoles(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { roles: { include: { role: true } } },
    });

    if (!user) return null;

    const roles = user.roles.map((ur) => ur.role.name);

    return {
      id: user.id,
      login: user.email,
      tag: user.name ?? user.email,
      createdAt: user.createdAt,
      updatedAt: user.createdAt,
      isActive: user.isActive,
      roles, // ✅ ДОБАВИЛИ
    };
  }

  async getAllWithRoles() {
    const users = await this.prisma.user.findMany({
      include: { roles: { include: { role: true } } },
      orderBy: { createdAt: "desc" },
    });

    return users.map((user) => {
      const roles = user.roles.map((user) => user.role.name);

      return {
        id: user.id,
        login: user.email,
        tag: user.name ?? user.email,
        createdAt: user.createdAt,
        updatedAt: user.createdAt,
        isActive: user.isActive,
        roles, // ✅ ДОБАВИЛИ
      };
    });
  }

  async byId(id: string, selectObject: Prisma.UserSelect = {}) {
    const user = await this.prisma.user.findUnique({
      where: {
        id
      },
      select: {
        ...returnUserObject,
        dealer: {
          select: {
            id: true,
            name: true,
            email: true,
            isActive: true,
          }
        },
        ...selectObject
      }
    })

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user
  }


  async deleteById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    await this.prisma.$transaction([
      this.prisma.userRole.deleteMany({
        where: { userId },
      }),
      this.prisma.user.delete({
        where: { id: userId },
      }),
    ]);

    return { success: true };
  }

  async setActive(id: string, isActive: boolean) {
    const user = await this.prisma.user.update({
      where: { id },
      data: { isActive },
      select: { id: true, email: true, isActive: true },
    });
    return user;
  }

  async changePasswordByAdmin(dto: { id: string; password: string }) {
    const { id, password } = dto;

    if (!id || !password) {
      throw new BadRequestException('id and password are required');
    }

    if (password.length < 4) {
      throw new BadRequestException('Password is too short');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await this.prisma.user.update({
      where: { id },
      data: { passwordHash },
    });

    return { success: true };
  }
}

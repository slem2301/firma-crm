import { Body, Controller, Delete, Get, Param, Patch, Put, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

import { UsersService } from "./users.service";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AdminChangePasswordDto } from "./dto/admin-change-password.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // ✅ список пользователей — только ADMIN
  @UseGuards(JwtAuthGuard)
  @Get()
  getAll() {
    return this.usersService.getAllWithRoles();
  }

  // ✅ текущий пользователь (можно всем авторизованным)
  @UseGuards(JwtAuthGuard)
  @Get("me")
  me(@Req() req: any) {
    return { user: req.user };
  }


  // ⚠️ временно оставь, если фронт где-то ждёт именно этот роут
  @UseGuards(JwtAuthGuard)
  @Get("get-by-token")
  async getByToken(@Req() req: any) {
    const userId = req.user.id;
    const user = await this.usersService.findByIdWithRoles(userId);
    return { user };
  }

  // @Delete(":id")
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles("ADMIN")
  // async deleteUser(@Param("id") id: string) {
  //   return this.usersService.deleteById(id);
  // }
  @Patch(":id/deactivate")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  deactivate(@Param("id") id: string) {
    return this.usersService.setActive(id, false);
  }

  @Patch(":id/activate")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  activate(@Param("id") id: string) {
    return this.usersService.setActive(id, true);
  }

  @Put('change-password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async changePasswordByAdmin(
    @Body() dto: { id: string; password: string }
  ) {
    return this.usersService.changePasswordByAdmin(dto);
  }

}

import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { AuthDto } from "./dto/auth.dto";
import express from 'express'


@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // @Post("login")
    // login(@Body() dto: LoginDto) {
    //     return this.authService.login(dto);
    // }
    @Post("login")
    login(@Body() dto: any) {
        return this.authService.login(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get("me")
    me(@Req() req: any) {
        return req.user;
    }

    @Post("register")
    async register(@Body() dto: AuthDto) {
        return this.authService.register(dto);
    }

    @HttpCode(200)
    @Get('logout')
    logout(@Res({ passthrough: true }) res: express.Response) {
        res.clearCookie('accessToken', { path: '/' })
        res.clearCookie('refreshToken', { path: '/' })
        res.clearCookie('token', { path: '/' })
        return { ok: true }
    }
}

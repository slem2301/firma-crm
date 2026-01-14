import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'

@Injectable()
export class MockAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest()

        const auth = req.headers['authorization'] as string | undefined
        if (!auth?.startsWith('Bearer ')) throw new UnauthorizedException('Missing Bearer token')

        // Здесь можно “раскодировать” токен, но для mock достаточно:
        req.user = { id: "u1", roles: ["ADMIN"], name: "Mock Admin" };


        return true
    }
}

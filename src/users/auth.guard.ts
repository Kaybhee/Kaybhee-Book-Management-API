import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from 'express'


@Injectable()
export class AuthGuard implements CanActivate {
    constructor( private jwtService: JwtService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const token = this.extractTokenFromHeader(request)
        console.log(token)
        if(!token){
            throw new UnauthorizedException();
        }

        try {
            const payload = await this.jwtService.verifyAsync(token)
            request['user'] = payload;
            console.log("The decoded payload", payload)

            return true
        }
        catch(err) {
            throw new UnauthorizedException("Invalid or expired token")
        }
    }
    private extractTokenFromHeader(request: Request): string | undefined{
        const [type, token] = request.headers.authorization?.split(' ') ?? []
        console.log("The type of: ", type)
        console.log("The token reg", token)
        return type === 'Bearer' ? token : undefined
        }
    }
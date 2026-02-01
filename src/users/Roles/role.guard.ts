import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Roles, ROLES_KEY } from '../Roles/roles.decorator'
import { Role } from "./enum.roles";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor( private reflector : Reflector) {}
    canActivate(context: ExecutionContext): boolean {
        const reqRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLES_KEY, [context.getHandler(), context.getClass()]
        )

        if (!reqRoles){
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        console.log("The user role", user.role)
        if (!user || !reqRoles.includes(user.role)) {
            throw new ForbiddenException('Access denied: insufficient role')
        }
        return true
    }
}
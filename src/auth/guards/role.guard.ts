import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Role } from "../enums/role.enum";
import { ROLES_KEY } from "../decorators/role.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        console.log(" requiredRoles:  ",requiredRoles);
        if(!requiredRoles){
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        console.log("user?.role:  ",user?.role);

        return matchRoles(requiredRoles, user?.role);
    }
}

function matchRoles(requiredRoles: string[], userRoles: string) {
    return requiredRoles.some((role) => userRoles.includes(role));
}
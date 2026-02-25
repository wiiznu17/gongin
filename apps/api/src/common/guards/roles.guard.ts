import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'; // เพิ่ม
import { Reflector } from '@nestjs/core'; // เพิ่ม

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    // เพิ่มการตรวจสอบว่ามี user object หรือไม่ก่อนเช็ค role
    return user && requiredRoles.includes(user.role);
  }
}

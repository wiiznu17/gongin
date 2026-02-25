import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) throw new UnauthorizedException();

    const {
      data: { user },
      error,
    } = await this.supabaseService.client.auth.getUser(token);

    if (error || !user) throw new UnauthorizedException();

    // ดึงข้อมูล Role จากตาราง profiles
    const { data: profile } = await this.supabaseService.adminClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    request.user = { ...user, role: profile?.role };
    return true;
  }
}

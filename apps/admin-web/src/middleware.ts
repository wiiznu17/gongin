import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * กำหนดให้ Middleware ทำงานเฉพาะในเส้นทางที่ต้องการ
     * เพื่อไม่ให้กระทบต่อไฟล์ Static เช่น รูปภาพ หรือ favicon
     */
    '/dashboard/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

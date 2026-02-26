import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  console.log('================ AUTH CALLBACK START ================');
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  console.log('Callback URL:', request.url);
  console.log('Code Received:', code ? 'YES (Present)' : 'NO (Missing)');

  if (code) {
    const cookieStore = await cookies();

    console.log('Initializing Supabase Admin Client for Session Exchange...');
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              console.log(`Setting Cookie in Callback -> ${name}`);
              cookieStore.set(name, value, options);
            });
          },
        },
      },
    );

    console.log('Exchanging Code for Session...');
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      console.log('Session Exchange: SUCCESS');
      console.log('User ID:', data.user?.id);
      console.log(`Redirecting to: ${origin}${next}`);
      console.log('================ AUTH CALLBACK END ==================');
      return NextResponse.redirect(`${origin}${next}`);
    }

    console.error('Session Exchange Error:', error.message);
  } else {
    console.warn('No code found in search parameters.');
  }

  console.log('Authentication failed, redirecting to /login');
  console.log('================ AUTH CALLBACK END ==================');
  return NextResponse.redirect(`${origin}/login`);
}

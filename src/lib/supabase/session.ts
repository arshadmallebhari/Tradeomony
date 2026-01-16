import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('CRITICAL: Supabase environment variables are missing in middleware!');
        return response;
    }

    const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    });
                },
            },
        }
    );

    // Refresh session to keep it alive
    await supabase.auth.refreshSession();
    const { data: { user } } = await supabase.auth.getUser();
    console.log('Middleware Path:', request.nextUrl.pathname, 'User ID:', user?.id);

    // Protect protected routes
    if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
        console.log('Redirecting to /login (no user)');
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login') && !user) {
        console.log('Redirecting to /admin/login (no user)');
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // New Log for successful pass-through
    if (user) {
        console.log('User detected, proceeding to:', request.nextUrl.pathname);
    }

    return response;
}

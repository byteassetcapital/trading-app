import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        'https://albctslyvkmfvpaerapn.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsYmN0c2x5dmttZnZwYWVyYXBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MzQ2MDcsImV4cCI6MjA4MTMxMDYwN30.etiDDeMIwEpf1MnE6aAaqpvb45EbSeplPdBlwDyGcks',
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value)
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protect routes that should be private
    // The 'protected' group folder in app directory doesn't appear in URL, 
    // but the pages inside do: /dashboard, /autonomous, /investment, /settings
    const protectedPaths = ['/dashboard', '/autonomous', '/investment', '/settings']
    const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))

    if (isProtectedPath && !user) {
        const loginUrl = request.nextUrl.clone()
        loginUrl.pathname = '/login'
        return NextResponse.redirect(loginUrl)
    }

    return response
}

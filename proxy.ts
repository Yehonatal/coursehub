import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth/session";
import { error } from "@/lib/logger";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protected routes
    const protectedRoutes = ["/dashboard", "/ai", "/resources", "/university"];

    const isProtected = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    );

    if (isProtected) {
        try {
            const { user } = await validateRequest();
            if (!user) {
                return NextResponse.redirect(new URL("/login", request.url));
            }
        } catch (err) {
            error("Middleware auth error:", err);
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
    ],
};

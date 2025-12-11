import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const sessionId = request.cookies.get("session_id")?.value;
    const isAuthPage =
        request.nextUrl.pathname.startsWith("/login") ||
        request.nextUrl.pathname.startsWith("/register");

    const protectedRoutes = ["/dashboard", "/ai", "/resources", "/university"];
    const isProtected = protectedRoutes.some((route) =>
        request.nextUrl.pathname.startsWith(route)
    );

    // Note: We only check for session existence here. Full validation (DB check)
    // happens in the Layout/Page via validateRequest(). This avoids Edge Runtime
    // limitations with non-HTTP DB drivers.
    if (isProtected && !sessionId) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isAuthPage && sessionId) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

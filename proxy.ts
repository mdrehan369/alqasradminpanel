import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const access_token = request.cookies.get("access_token")?.value;
    if (access_token && request.nextUrl.pathname == "/signin")
        return NextResponse.redirect(new URL("/", request.url));
    if (request.nextUrl.pathname == "/signin") return NextResponse.next();
    if (!access_token)
        return NextResponse.redirect(new URL("/signin", request.url));
    return NextResponse.next();
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
    matcher: [
        // Exclude API routes, static files, image optimizations, and .png files
        "/((?!api|_next/static|_next/image|.*\\.png$).*)",
    ],
};

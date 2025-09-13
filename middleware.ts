import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    // Allow public routes without token
    if (!token && !req.nextUrl.pathname.startsWith("/api/auth")) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/api/users/:path*"],
};
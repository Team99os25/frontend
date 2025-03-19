import { NextRequest, NextResponse } from "next/server";
const rateLimitMap = new Map<string, { count: number; lastRequest: number }>();

const LIMIT = 10;
const WINDOW_MS = 60 * 1000;

export function middleware(req: NextRequest): NextResponse {
    const ip: string =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "Unknown IP";

    const userAgent: string = req.headers.get("user-agent") || "Unknown User-Agent";
    const referer: string = req.headers.get("referer") || "Direct Visit";

    console.log(`📥 Request: ${req.method} ${req.nextUrl.pathname} | IP: ${ip} | User-Agent: ${userAgent} | Referer: ${referer}`);

    // Only apply rate limiting to API routes
    if (req.nextUrl.pathname.startsWith("/api/")) {
        const now = Date.now();
        const requestInfo = rateLimitMap.get(ip) || { count: 0, lastRequest: now };

        if (now - requestInfo.lastRequest > WINDOW_MS) {
            requestInfo.count = 1;
            requestInfo.lastRequest = now;
        } else {
            requestInfo.count += 1;
        }

        rateLimitMap.set(ip, requestInfo);

        console.log(`⚡ [API LIMIT] IP: ${ip} has made ${requestInfo.count} requests`);

        if (requestInfo.count > LIMIT) {
            console.warn(`⛔ Rate limit exceeded for IP: ${ip}`);
            return new NextResponse("Too many requests. Try again later.", { status: 429 });
        }
    }

    return NextResponse.next();
}

// Apply middleware globally, but only limit `/api/*` routes
export const config = {
    matcher: "/:path*",
};

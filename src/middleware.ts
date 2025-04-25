import { NextResponse, type NextRequest } from "next/server";
import { createMiddlewareClient } from "./lib/supabase/middleware";

export async function middleware(request: NextRequest) {
    try {
        // Create a Supabase client configured to use cookies
        const { supabase, response } = await createMiddlewareClient(request);

        // Refresh session if expired - required for Server Components
        await supabase.auth.getSession();

        return response;
    } catch (e) {
        // If there's an error, return the original response
        return NextResponse.next();
    }
}

// Ensure the middleware is only called for relevant paths
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};

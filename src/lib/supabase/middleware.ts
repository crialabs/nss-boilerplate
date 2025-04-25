import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "../env";
import { Database } from "@/types/database";

export const createMiddlewareClient = async (request: NextRequest) => {
    // Create an unmodified response
    let response = NextResponse.next();

    const supabase = createServerClient<Database>(
        env().NEXT_PUBLIC_SUPABASE_URL,
        env().NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                // Get cookies from the request
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                // Set cookies on the response
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
                // Remove cookies from the response
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: "",
                        ...options,
                    });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({
                        name,
                        value: "",
                        ...options,
                    });
                },
            },
        },
    );

    return { supabase, response };
}; 
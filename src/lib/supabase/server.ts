import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { env } from "../env";
import { Database } from "@/types/database";

export function createServerComponentClient() {
    return createServerClient<Database>(
        env().NEXT_PUBLIC_SUPABASE_URL,
        env().NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                get(name: string) {
                    // For server components, we don't need to implement this
                    // as cookies are handled by the middleware
                    return undefined;
                },
                set(name: string, value: string, options: CookieOptions) {
                    // For server components, we don't need to implement this
                    // as cookies are handled by the middleware
                },
                remove(name: string, options: CookieOptions) {
                    // For server components, we don't need to implement this
                    // as cookies are handled by the middleware
                },
            },
        },
    );
}

export default createServerComponentClient;

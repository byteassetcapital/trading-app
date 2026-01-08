import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy initialization to avoid build-time errors
let supabaseAdminInstance: SupabaseClient | null = null;

export function getSupabaseAdmin() {
    if (!supabaseAdminInstance) {
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
            throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
        }

        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
        }

        supabaseAdminInstance = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        );
    }
    return supabaseAdminInstance;
}

// Export a proxy object to maintain backward compatibility if possible,
// but simpler to just change usages to getSupabaseAdmin() since I have full control.
// However, to minimize changes, I can export an object that behaves like the client?
// No, SupabaseClient is complex. Let's just export the function and update usages.
export const supabaseAdmin = {
    from: (table: string) => getSupabaseAdmin().from(table),
    // Add other methods if needed, but 'from' is the main one used.
    // Actually, let's just update the usages. It's safer.
};

import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!url || !anonKey) {
    // Do not throw during import; allow callers to handle missing env during build
    // eslint-disable-next-line no-console
    console.warn(
        "Supabase URL or anon key not set — supabase client will not be initialized"
    );
}

export const supabase: SupabaseClient | null =
    url && anonKey ? createClient(url, anonKey) : null;

export const supabaseAdmin: SupabaseClient | null =
    url && serviceKey ? createClient(url, serviceKey) : null;

export default { supabase, supabaseAdmin };

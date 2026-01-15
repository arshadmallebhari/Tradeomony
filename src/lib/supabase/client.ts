import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        if (typeof window !== 'undefined') {
            throw new Error('Missing Supabase environment variables');
        }
        // Return null during build/SSR when env vars might not be available
        return null;
    }

    return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}

export const supabase = createClient();

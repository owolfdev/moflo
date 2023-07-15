import { createClient } from "@supabase/supabase-js";
// import { createClient as createRealtimeClient } from "@supabase/realtime-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
// export const realtime = createRealtimeClient(supabaseUrl, supabaseKey);

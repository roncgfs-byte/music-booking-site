// ============================================
// Book Your Band
// Supabase Connection
// ============================================

// Your Supabase Project URL
const SUPABASE_URL = "https://oyeopxbtdrvtmdedsoli.supabase.co";

// Your Publishable API Key
const SUPABASE_ANON_KEY = "PASTE_YOUR_PUBLISHABLE_KEY_HERE";

// Create Supabase Client
const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

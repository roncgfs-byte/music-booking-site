// ============================================
// Book Your Band
// Supabase Connection
// ============================================

// Your Supabase Project URL
const SUPABASE_URL = "https://oyeopxbtdrvtmdedsoli.supabase.co";

// Your Publishable API Key
const SUPABASE_ANON_KEY = "sb_publishable_1eq1XDcLRotp2UDxg-WuAQ_ez0l30oW";

// Create Supabase Client
const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

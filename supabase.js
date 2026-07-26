// ============================================
// Book Your Band
// Supabase Connection
// ============================================

// Your Supabase Project URL
const SUPABASE_URL = "https://oyeopxbtdrvtmdedsoli.supabase.co";

const SUPABASE_ANON_KEY = "sb_publishable_1eq1XDcLRotp2UDxg-WuAQ_ez0l30oW";

const { createClient } = supabase;

const supabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("artist-login");

  if (!form) return;

  form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    message.textContent = "Signing in...";

    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      message.textContent = error.message;
    } else {
      message.textContent = "Sign in successful.";
    }

  });

});

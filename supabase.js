const SUPABASE_URL = "https://oyeopxbtdrvtmdedsoli.supabase.co";
const SUPABASE_ANON_KEY =
  "sb_publishable_1eq1XDcLRotp2UDxg-WuAQ_ez0l30oW";

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", () => {

  // SIGN IN
  const loginForm = document.getElementById("artist-login");

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const message = document.getElementById("message");

      message.textContent = "Signing in...";

      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

      message.textContent = error
        ? error.message
        : "Sign in successful.";
    });
  }

  // REQUEST PASSWORD RESET
  const forgotPasswordLink =
    document.getElementById("forgot-password");

  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", async (event) => {
      event.preventDefault();

      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message");

      if (!email) {
        message.textContent =
          "Please enter your email address first.";
        return;
      }

      message.textContent = "Sending password reset email...";

      const { error } =
        await supabaseClient.auth.resetPasswordForEmail(email, {
          redirectTo:
            "https://bookyourband.ca/reset-password.html"
        });

      message.textContent = error
        ? error.message
        : "Password reset email sent. Please check your inbox.";
    });
  }

  // SAVE NEW PASSWORD
  const resetForm =
    document.getElementById("reset-password-form");

  if (resetForm) {
    resetForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const newPassword =
        document.getElementById("new-password").value;
      const message = document.getElementById("message");

      message.textContent = "Updating password...";

      const { error } = await supabaseClient.auth.updateUser({
        password: newPassword
      });

      message.textContent = error
        ? error.message
        : "Password updated successfully. Return to Sign In.";
    });
  }

  // SECURE LOGOUT
  if (window.location.pathname.endsWith("/logout.html")) {
    const message = document.getElementById("message");

    supabaseClient.auth.signOut().then(({ error }) => {
      if (error) {
        message.textContent = error.message;
        return;
      }

      message.textContent = "You have been securely signed out.";

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    });
  }

});

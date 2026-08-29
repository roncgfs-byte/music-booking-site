// Version 1.0 post-release correction: Artist registration authentication.
// This capture-phase handler runs before the older artist handler in script.js.
document.addEventListener("DOMContentLoaded", () => {
  const form = document.forms["artist-application"];
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    const email = form.email?.value.trim() || "";
    const password = document.getElementById("artist-password")?.value || "";

    const artist = {
      artist_name: form.artist_name?.value || "",
      last_name: "",
      email,
      phone: form.phone?.value || "",
      city: form.city?.value || "",
      country: "",
      equipment: Array.from(form.querySelectorAll('input[name="equipment"]:checked')).map(item => item.value).join(", "),
      youtube_link_1: form.video_1?.value || "",
      youtube_link_2: form.video_2?.value || "",
      youtube_link_3: form.video_3?.value || "",
      youtube_link_4: form.video_4?.value || "",
      availability: Array.from(form.querySelectorAll('input[name="availability"]:checked')).map(item => item.value).join(", "),
      music_styles: Array.from(form.querySelectorAll('input[name="music_styles"]:checked')).map(item => item.value).join(", ")
    };

    const { data: signUpData, error: signUpError } = await db.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: "https://bookyourband.ca/signin.html" }
    });

    if (signUpError) {
      alert("Unable to create Artist account:\n\n" + signUpError.message);
      return;
    }

    if (!signUpData.user || signUpData.user.identities?.length === 0) {
      alert("This email is already registered. Please use Artist Sign In or Forgot Password instead.");
      return;
    }

    const { error: profileError } = await db.from("artists").insert([artist]);

    if (profileError) {
      if (profileError.code === "23505") {
        alert("This email already has an Artist profile. Please confirm your email if requested, then use Artist Sign In or Forgot Password.");
      } else {
        alert("Artist account was created, but the Artist profile could not be saved. Please contact Book Your Band support before trying again.");
      }
      return;
    }

    form.submit();
  }, true);
});

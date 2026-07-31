const SUPABASE_URL = "https://oyeopxbtdrvtmdedsoli.supabase.co";

const SUPABASE_ANON_KEY =
  "sb_publishable_1eq1XDcLRotp2UDxg-WuAQ_ez0l30oW";

const { createClient } = supabase;

const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", () => {
  const form = document.forms["artist-application"];

  if (!form) {
    console.error("Artist form not found.");
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const artist = {
      name: form.artist_name?.value || "",
      email: form.email?.value || "",
      phone: form.phone?.value || "",
      city: form.city?.value || "",
      you_tube: form.link?.value || ""
    };

    const { error } = await db
      .from("artists")
      .insert([artist]);

    if (error) {
      console.error(error);
      alert("Unable to save the artist registration.");
      return;
    }

    form.submit();
  });
});

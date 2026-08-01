const SUPABASE_URL = "https://oyeopxbtdrvtmdedsoli.supabase.co";

const SUPABASE_ANON_KEY =
  "sb_publishable_1eq1XDcLRotp2UDxg-WuAQ_ez0l30oW";

const { createClient } = supabase;

const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", () => {
  const form = document.forms["artist-application"];

  if (form) {

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const artist = {
  artist_name: form.artist_name?.value || "",
  last_name: "",
  email: form.email?.value || "",
  phone: form.phone?.value || "",
  city: form.city?.value || "",
  country: "",
  equipment: Array.from(
  form.querySelectorAll('input[name="equipment"]:checked')
)
.map(item => item.value)
.join(", "),
  youtube_link_1: form.video_1?.value || "",
youtube_link_2: form.video_2?.value || "",
youtube_link_3: form.video_3?.value || "",
youtube_link_4: form.video_4?.value || "",
  availability: Array.from(
  form.querySelectorAll('input[name="availability"]:checked')
)
.map(item => item.value)
.join(", "),
 music_styles: Array.from(
  form.querySelectorAll('input[name="music_styles"]:checked')
)
.map(item => item.value)
.join(", "),     
};
    const { error } = await db
      .from("artists")
      .insert([artist]);

    if (error) {
  console.error("SUPABASE ERROR:", error);
  alert(
    "Supabase says:\n\n" +
    JSON.stringify(error, null, 2)
  );
  return;
}

  form.submit();
  });
}
}); 
const venueForm = document.forms["venue-application"];

if (venueForm) {
  venueForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const venue = {
      venue_name: venueForm.venue_name?.value || "",
      contact_name: venueForm.contact_name?.value || "",
      email: venueForm.email?.value || "",
      phone: venueForm.phone?.value || "",
      city: venueForm.city?.value || "",
      country: venueForm.country?.value || "",
      music_style: venueForm.music_style?.value || "",
      booking_days: venueForm.booking_days?.value || ""
    };

    const { error } = await db
      .from("venues")
      .insert([venue]);

    if (error) {
      alert(
        "Supabase says:\n\n" +
        JSON.stringify(error, null, 2)
      );
      return;
    }

    venueForm.submit();
  });
}
document.addEventListener("DOMContentLoaded", async () => {
  const artistSelect = document.getElementById("artist_name");

  if (!artistSelect) return;

  const { data, error } = await db
    .from("artists")
    .select("artist_name")
    .order("artist_name");

  if (error) {
    console.error(error);
    artistSelect.innerHTML =
      '<option value="">Unable to load artists</option>';
    return;
  }

  artistSelect.innerHTML =
    '<option value="">Select an Artist</option>';

  data.forEach((artist) => {
    const option = document.createElement("option");
    option.value = artist.artist_name;
    option.textContent = artist.artist_name;
    artistSelect.appendChild(option);
  });
});

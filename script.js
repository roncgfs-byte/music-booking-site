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
document.getElementById("artist_name")?.addEventListener("change", async function () {

  const artistName = this.value;

  if (!artistName) {
    document.getElementById("artistProfile").style.display = "none";
    return;
  }

  const { data, error } = await db
    .from("artists")
    .select("*")
    .eq("artist_name", artistName)
    .single();

  if (error) {
    console.error(error);
    return;
  }

  document.getElementById("artistProfile").style.display = "block";

  document.getElementById("profileArtist").textContent = data.artist_name || "";
  document.getElementById("profileCity").textContent = data.city || "";
  document.getElementById("profileMusic").textContent = data.music_styles || "";
  document.getElementById("profileEquipment").textContent = data.equipment || "";
  document.getElementById("profileAvailability").textContent = data.availability || "";

  const youtube = [
    data.youtube_link_1,
    data.youtube_link_2,
    data.youtube_link_3,
    data.youtube_link_4
  ];

  ["yt1", "yt2", "yt3", "yt4"].forEach((id, index) => {
    const link = document.getElementById(id);
    const url = youtube[index];

    if (url) {
      link.href = url;
      link.textContent = url;
    } else {
      link.removeAttribute("href");
      link.textContent = "";
    }
  });

});
const bookingForm = document.forms["booking-request"];

if (bookingForm) {
  bookingForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const booking = {
      venue_id: null,
      artist_name: bookingForm.artist_name?.value || "",
      title: bookingForm.title?.value || "",
      description: bookingForm.details?.value || "",
      event_date: bookingForm.booking_date?.value || "",
      start_time: bookingForm.start_time?.value || "",
      end_time: bookingForm.end_time?.value || "",
      music_style: bookingForm.music_style?.value || "",
      budget: bookingForm.budget?.value || 0,
      status: "Pending"
    };

    const { error } = await db
      .from("bookings")
      .insert([booking]);

    if (error) {
      alert(
        "Supabase says:\n\n" +
        JSON.stringify(error, null, 2)
      );
      return;
    }

    bookingForm.submit();
  });
}
document.addEventListener("DOMContentLoaded", async () => {

  const bookingTable = document.querySelector("#bookingTable tbody");

  if (!bookingTable) return;

  const { data, error } = await db
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  bookingTable.innerHTML = "";

  data.forEach((booking) => {

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${booking.artist_name || ""}</td>
      <td>${booking.title || ""}</td>
      <td>${booking.event_date || ""}</td>
      <td>${booking.status || ""}</td>
<td>
  <button onclick="updateBookingStatus('${booking.id}','Accepted')">Accept</button>

  <button onclick="updateBookingStatus('${booking.id}','Declined')">Decline</button>

  <button onclick="updateBookingStatus('${booking.id}','Completed')">Complete</button>
</td>
    `;

    bookingTable.appendChild(row);

  });

});
async function updateBookingStatus(id, status) {

  const { error } = await db
    .from("bookings")
    .update({ status: status })
    .eq("id", id);

  if (error) {
    alert(
      "Supabase says:\n\n" +
      JSON.stringify(error, null, 2)
    );
    return;
  }

  location.reload();

}
document.addEventListener("DOMContentLoaded", async () => {

  const venueTable = document.querySelector("#venueBookings tbody");

  if (!venueTable) return;

  const { data, error } = await db
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  venueTable.innerHTML = "";

  data.forEach((booking) => {

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${booking.artist_name || ""}</td>
      <td>${booking.title || ""}</td>
      <td>${booking.event_date || ""}</td>
      <td>${booking.status || ""}</td>
    `;

    venueTable.appendChild(row);

  });

});
document.addEventListener("DOMContentLoaded", async () => {

  const artistTable = document.querySelector("#artistBookings tbody");

  if (!artistTable) return;

  const { data, error } = await db
    .from("bookings")
    .select("*")
    .eq("artist_name", "Blue Horizon")
    .order("event_date", { ascending: true });

  if (error) {
    console.error(error);
    return;
  }

  artistTable.innerHTML = "";

  data.forEach((booking) => {

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${booking.title || ""}</td>
      <td>${booking.event_date || ""}</td>
      <td>${booking.status || ""}</td>
    `;

    artistTable.appendChild(row);

  });

});

const SUPABASE_URL = "https://oyeopxbtdrvtmdedsoli.supabase.co";

exports.handler = async function () {
  try {
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const siteUrl = process.env.URL;

    if (!supabaseKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "SUPABASE_SERVICE_ROLE_KEY is not configured."
        })
      };
    }

    if (!siteUrl) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Netlify site URL is not available."
        })
      };
    }

    // Find tomorrow's Accepted bookings
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const eventDate = tomorrow.toISOString().split("T")[0];

    const bookingResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/bookings?status=eq.Accepted&event_date=eq.${eventDate}&select=*`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`
        }
      }
    );

    const bookings = await bookingResponse.json();

    if (!bookingResponse.ok) {
      return {
        statusCode: bookingResponse.status,
        body: JSON.stringify({
          error: "Unable to retrieve bookings.",
          details: bookings
        })
      };
    }

    let remindersSent = 0;
    const errors = [];

    for (const booking of bookings) {

      // Find the selected artist's email address
      const artistResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/artists?artist_name=eq.${encodeURIComponent(
          booking.artist_name
        )}&select=email&limit=1`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`
          }
        }
      );

      const artists = await artistResponse.json();

      if (
        !artistResponse.ok ||
        !artists.length ||
        !artists[0].email
      ) {
        errors.push(
          `No artist email found for ${booking.artist_name || "Unknown Artist"}`
        );
        continue;
      }

      // Send the reminder through our existing reminder function
      const reminderResponse = await fetch(
        `${siteUrl}/.netlify/functions/send-booking-reminder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            artistName: booking.artist_name || "",
            artistEmail: artists[0].email,
            venueName: "",
            venueEmail: "",
            title: booking.title || "",
            eventDate: booking.event_date || "",
            startTime: booking.start_time || "",
            endTime: booking.end_time || ""
          })
        }
      );

      if (reminderResponse.ok) {
        remindersSent++;
      } else {
        const reminderError = await reminderResponse.text();
        errors.push(
          `Reminder failed for ${booking.artist_name || "Unknown Artist"}: ${reminderError}`
        );
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        eventDate: eventDate,
        bookingsFound: bookings.length,
        remindersSent: remindersSent,
        errors: errors
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Reminder check failed.",
        details: error.message
      })
    };
  

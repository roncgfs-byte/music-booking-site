const SUPABASE_URL = "https://oyeopxbtdrvtmdedsoli.supabase.co";

exports.handler = async function () {
  try {
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "SUPABASE_SERVICE_ROLE_KEY is not configured."
        })
      };
    }

    // Tomorrow's date in YYYY-MM-DD format
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const eventDate = tomorrow.toISOString().split("T")[0];

    // Find Accepted bookings taking place tomorrow
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/bookings?status=eq.Accepted&event_date=eq.${eventDate}&select=*`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`
        }
      }
    );

    const bookings = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: "Unable to retrieve bookings.",
          details: bookings
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        eventDate: eventDate,
        bookingsFound: bookings.length
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
  }
};

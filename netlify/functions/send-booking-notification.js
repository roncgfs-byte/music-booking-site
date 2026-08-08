exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: ""
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        error: "Method not allowed."
      })
    };
  }

  try {
    const {
      artistName,
      venueName,
      contactName,
      email,
      phone,
      bookingDate,
      message
    } = JSON.parse(event.body || "{}");

    if (!artistName || !venueName || !email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Artist name, venue name and email are required."
        })
      };
    }

    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured.");
    }

    const safe = (value) =>
      String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "book-your-band/1.0"
      },
      body: JSON.stringify({
        from: "Book Your Band <bookings@bookyourband.ca>",
        to: [
          "ron@bookyourband.ca",
          "brad@bookyourband.ca"
        ],
        reply_to: email,
        subject: `New Booking Request - ${artistName}`,
        html: `
          <h2>New Book Your Band Booking Request</h2>

          <p><strong>Artist / Band:</strong> ${safe(artistName)}</p>
          <p><strong>Venue:</strong> ${safe(venueName)}</p>
          <p><strong>Contact:</strong> ${safe(contactName)}</p>
          <p><strong>Email:</strong> ${safe(email)}</p>
          <p><strong>Phone:</strong> ${safe(phone)}</p>
          <p><strong>Requested Date:</strong> ${safe(bookingDate)}</p>
          <p><strong>Message:</strong><br>${safe(message)}</p>

          <hr>

          <p>Book Your Band<br>
          Connecting Artists and Venues for Live Music</p>
        `
      })
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Resend error:", result);

      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({
          error: "Booking notification could not be sent.",
          details: result
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: "Booking notification sent.",
        emailId: result.id
      })
    };

  } catch (error) {
    console.error("Booking notification error:", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Booking notification failed.",
        details: error.message
      })
    };
  }
};

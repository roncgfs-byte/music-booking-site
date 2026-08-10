exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed." })
    };
  }

  try {
    const {
      artistName,
      artistEmail,
      venueName,
      venueEmail,
      title,
      eventDate,
      startTime,
      endTime
    } = JSON.parse(event.body || "{}");

    if (!artistEmail || !eventDate) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Artist email and event date are required."
        })
      };
    }

    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "RESEND_API_KEY is not configured."
        })
      };
    }

    const recipients = [artistEmail];

    if (venueEmail) {
      recipients.push(venueEmail);
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Book Your Band <bookings@bookyourband.ca>",
        to: recipients,
        subject: `Reminder: ${title || "Upcoming Booking"}`,
        html: `
          <h2>Book Your Band - Booking Reminder</h2>

          <p>This is a reminder about your upcoming confirmed booking.</p>

          <p><strong>Artist:</strong> ${artistName || ""}</p>
          <p><strong>Venue:</strong> ${venueName || ""}</p>
          <p><strong>Event:</strong> ${title || ""}</p>
          <p><strong>Date:</strong> ${eventDate}</p>
          <p><strong>Start Time:</strong> ${startTime || ""}</p>
          <p><strong>End Time:</strong> ${endTime || ""}</p>

          <p>Please contact the other party if any arrangements need to be confirmed or changed.</p>

          <p>Book Your Band</p>
        `
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: "Reminder email could not be sent.",
          details: data
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Booking reminder sent.",
        data: data
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Booking reminder could not be sent.",
        details: error.message
      })
    };
  }
};

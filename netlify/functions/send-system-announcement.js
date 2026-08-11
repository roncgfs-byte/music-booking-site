exports.handler = async function (event) {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" })
      };
    }

    const resendKey = process.env.RESEND_API_KEY;

    if (!resendKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "RESEND_API_KEY is not configured."
        })
      };
    }

    const data = JSON.parse(event.body || "{}");

    const recipient = data.recipient;
    const subject = data.subject;
    const message = data.message;

    if (!recipient || !subject || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Recipient, subject and message are required."
        })
      };
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Book Your Band <bookings@bookyourband.ca>",
        to: [recipient],
        subject: subject,
        html: `
          <h2>Book Your Band</h2>
          <p>${message}</p>
          <p>
            Thank you for being part of Book Your Band.
          </p>
          <p>
            Book Your Band<br>
            Connecting Artists and Venues for Live Music
          </p>
        `
      })
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: "Unable to send system announcement.",
          details: result
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "System announcement sent successfully."
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "System announcement failed.",
        details: error.message
      })
    };
  }
};

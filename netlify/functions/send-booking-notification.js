exports.handler = async () => {

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Booking notification function is working."
    })
  };

};

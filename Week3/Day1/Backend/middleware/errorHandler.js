// Generic centralized error handler
module.exports = (err, req, res, next) => {
  console.error(err);

  // If headers already sent, delegate to default handler
  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    success: false,
    data: null,
    message: 'Something went wrong on the server'
  });
};

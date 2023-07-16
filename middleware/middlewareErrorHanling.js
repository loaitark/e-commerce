const globalError = (req, res, next, err) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "erroe";

  res.status(400).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

module.exports = globalError;

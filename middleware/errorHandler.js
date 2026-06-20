const errorHandler = (err, req, res, next) => {
  console.error(err.message);
  console.error(err.stack || "No stack trace available");
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Internal Server Error" });
};

module.exports = errorHandler;

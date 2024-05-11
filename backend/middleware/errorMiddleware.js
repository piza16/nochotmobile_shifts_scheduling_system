const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Check for mongoose bad ObjectId
  // if (err.name === "CastError" && err.kind === "ObjectId") {
  //   message = "Resource not found";
  //   statusCode = 404;
  // }

  // Check for MongoDB E11000 duplicate key error
  if (err.code === 11000 || (err.message && err.message.includes("E11000"))) {
    message = "האימייל כבר קיים במערכת";
    statusCode = 400;
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};

export { notFound, errorHandler };

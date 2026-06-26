import logger from "../utils/logger.js";

const errorHandler = (err, req, res, _next) => {
  console.log("Unhandled error on " + req.method + " " + req.path + ": " + err.message);
  
  if (process.env.NODE_ENV != "production") {
    console.log("Stack trace: " + err.stack);
  }

  let statusCode = err.statusCode;
  if (statusCode == undefined) {
    statusCode = err.status;
  }
  if (statusCode == undefined) {
    statusCode = 500;
  }

  const response = {
    success: false,
    error: err.message,
  };
  
  if (err.message == undefined) {
    response.error = "Internal Server Error";
  }

  if (process.env.NODE_ENV != "production") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

export default errorHandler;

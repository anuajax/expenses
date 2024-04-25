// const errorHandler = (error, req, res, next) => {
//     console.log(error);
//     return res.status(error.status || 500).json({
//         error: {
//             message: error.message || 'Something went wrong!'
//         }
//     });
// }
// module.exports = errorHandler;
const ErrorResponse = require("./error");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  if (err.code === 11000) {
    const message = `Duplicate Field value entered`;
    error = new ErrorResponse(message, 400);
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  console.log(error.message);

  res.status(error.status || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

module.exports = errorHandler;
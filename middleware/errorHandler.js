const { UnauthorizedError } = require("express-jwt");
const { RequestError } = require("../RequestError");

module.exports.errorHandler = function (err, req, res, _) {
  if (err instanceof UnauthorizedError) {
    console.log("UnauthorizedError", req.headers);
    return res
      .status(401)
      .json({ msg: "UnauthorizedError: invalid token or no token provided" });
  }

  if (err instanceof RequestError) {
    return res.status(400).json({ msg: err.message });
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res
    .status(res.statusCode >= 400 ? res.statusCode : 500)
    .json({ msg: err.message || "Internal server error!" });
};

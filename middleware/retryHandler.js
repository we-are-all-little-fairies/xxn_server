const { UnauthorizedError } = require("express-jwt");
const { findUser } = require("../db/interfaces/users");
const { catchError } = require("./catchError");
const { RequestError } = require("../RequestError");

module.exports.retryHandler = catchError(async (req, _, next) => {
  //   检查用户是否在数据库中，在数据库中，并且retry大于0，才可以请求接口
  const user = findUser(req.auth.user);

  if (!user) {
    throw new UnauthorizedError(
      "invalid_token",
      "u has not permission to access the system"
    );
  }

  if ((user.retry || 0) <= 0) {
    throw new RequestError("no retry count");
  }

  next();
});

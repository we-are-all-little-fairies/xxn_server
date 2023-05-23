var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const { insertUser, findUser } = require("../db/interfaces/users");
const { catchError } = require("../middleware/catchError");
const { UnauthorizedError } = require("express-jwt");
const { RequestError } = require("../RequestError");

const GOD_TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Im5hbWUiOiJ6cyIsInBhc3N3b3JkIjoxMjN9LCJpYXQiOjE2ODQzOTI4NDcsImV4cCI6MTY4NDQ3OTI0N30.awkjAJhLorZNIqfPCv4LGu0jjMfO2SheUzODt-LqFfA";
/* GET users listing. */
router.post(
  "/register",
  catchError(async (req, res, _) => {
    //只有带了上帝token的才可以注册用户

    if (req.header("authorization") !== GOD_TOKEN) {
      throw new UnauthorizedError(
        "invalid_token",
        "u has not permission to access the system"
      );
    }

    if (!req.body.name || !req.body.password) {
      throw new RequestError();
    }

    const token = jwt.sign(
      { user: { name: req.body.name, password: req.body.password } },
      SECRET_KEY,
      { expiresIn: "7d" }
    );

    actionLogger.info("🚀 → token", token);

    await insertUser(req.body.name, req.body.password, token);
    res.json({
      token,
    });
  })
);

router.get(
  "/query",
  catchError(async (req, res) => {
    //只有带了上帝token的才可以注册用户
    const dbRes = await findUser(req.auth.user);
    if (dbRes && dbRes.retry && dbRes.token) {
      res.json({
        retry: dbRes.retry,
      });
    } else {
      throw new Error("no user");
    }
  })
);

module.exports = router;

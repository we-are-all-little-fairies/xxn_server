const express = require("express");
const cookieParser = require("cookie-parser");
const magicRouter = require("./routes/magic");
const userRouter = require("./routes/users");
const log4js = require("log4js");
const cors = require("cors");
const { expressjwt } = require("express-jwt");
const { errorHandler } = require("./middleware/errorHandler");

global.SECRET_KEY = "we_are_xxn_xixixi^-^"; // 与生成token的密钥要一致!
global.actionLogger = log4js.getLogger("cheese");
global.dbLogger = log4js.getLogger("dblogs");

const date = {
  appenders: {
    httpRequestFiles: {
      type: "dateFile",
      filename: "httpLogs/magic",
      pattern: "-yyyy-mm-dd-hh-mm.log",
      //包含模型  不加这一句的话和上面的方式  输出一样
      alwaysIncludePattern: true,
    },
    actionLogs: {
      type: "dateFile",
      filename: "actionLogs/magic",
      pattern: "-yyyy-mm-dd-hh-mm.log",
      //包含模型  不加这一句的话和上面的方式  输出一样
      alwaysIncludePattern: true,
    },
    dbLogs: {
      type: "dateFile",
      filename: "dbLogs/magic",
      pattern: "-yyyy-mm-dd-hh-mm.log",
      //包含模型  不加这一句的话和上面的方式  输出一样
      alwaysIncludePattern: true,
    },
    out: { type: "stdout" },
  },
  categories: {
    default: {
      appenders: ["httpRequestFiles", "out"],
      level: "info",
    },
    cheese: {
      appenders: ["actionLogs", "out"],
      level: "info",
    },
    dblogs: {
      appenders: ["actionLogs", "out"],
      level: "info",
    },
  },
  disableClustering: true,
};

log4js.configure(date);
const logger = log4js.getLogger("default");

const app = express();

app.use(
  log4js.connectLogger(logger, {
    level: "auto",
    // include the Express request ID in the logs
    format: (req, res, format) =>
      format(
        `:remote-addr - ${
          req.id
        } - ":method :url HTTP/:http-version" :status \n headers - ${JSON.stringify(
          req.headers
        )} \n query - ${JSON.stringify(
          req.query
        )} \n requestBody - ${JSON.stringify(req.body)}`
      ),
  })
);
// 允许跨域资源共享
// app.use(cors());

// 1. 使用中间件解析token
// 2. 使用 .unless 排除无需校验的路由(比如: 登录)
app.use(
  expressjwt({
    secret: SECRET_KEY,
    algorithms: ["HS256"], // 使用何种加密算法解析
  })
    .unless({ path: ["/users/register"] })
    .unless({ path: ["/magic/xhs"] })
    .unless({ path: ["/magic/xhs/refine"] })
    .unless({ path: ["/magic/bypass"] })
    .unless({ path: ["/magic/generate/pics"] })
);

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/magic", magicRouter);
app.use("/users", userRouter);
app.use(errorHandler);

module.exports = app;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
// var logger = require('morgan');

var indexRouter = require('./routes/index');
var magicRouter = require('./routes/magic');
var userRouter = require('./routes/users');


var log4js = require("log4js");

let date = {
    appenders: {
        'httpRequestFiles': {
            type: 'dateFile',
            filename: 'httpLogs/magic',
            pattern: '-yyyy-mm-dd-hh-mm.log',
            //包含模型  不加这一句的话和上面的方式  输出一样
            alwaysIncludePattern: true
        },
        'actionLogs': {
            type: 'dateFile',
            filename: 'actionLogs/magic',
            pattern: '-yyyy-mm-dd-hh-mm.log',
            //包含模型  不加这一句的话和上面的方式  输出一样
            alwaysIncludePattern: true
        },
        'dbLogs': {
            type: 'dateFile',
            filename: 'dbLogs/magic',
            pattern: '-yyyy-mm-dd-hh-mm.log',
            //包含模型  不加这一句的话和上面的方式  输出一样
            alwaysIncludePattern: true
        },
        'out': {type: 'stdout'}
    },
    categories: {
        default: {
            appenders: ['httpRequestFiles', 'out'],
            level: "info"
        },
        cheese: {
            appenders: ['actionLogs', 'out'],
            level: "info"
        },
        dblogs: {
            appenders: ['actionLogs', 'out'],
            level: "info"
        }
    },
    disableClustering: true
}

log4js.configure(date);

var logger = log4js.getLogger("default");

global.actionLogger = log4js.getLogger("cheese");
global.dbLogger = log4js.getLogger("dblogs");
var app = express();

// app.use(log4js.connectLogger(logger, { level: "auto" }));
app.use(
    log4js.connectLogger(logger, {
        level: "auto",
        // include the Express request ID in the logs
        format: (req, res, format) =>
            format(
                `:remote-addr - ${req.id} - ":method :url HTTP/:http-version" :status \n headers - ${JSON.stringify(req.headers)} \n query - ${JSON.stringify(req.query)} \n requestBody - ${JSON.stringify(req.body)}`
            ),
    })
);
// 允许跨域资源共享
const cors = require("cors");
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.js
// 导入校验token的模块, 解析JWT字符串, 还原成 JSON 对象 的模块
const expressjwt = require("express-jwt");
global.SECRET_KEY = 'we_are_xxn_xixixi^-^' // 与生成token的密钥要一致!

// 1. 使用中间件解析token
// 2. 使用 .unless 排除无需校验的路由(比如: 登录)
app.use(
    expressjwt.expressjwt({
        secret: SECRET_KEY,
        algorithms: ['HS256'], // 使用何种加密算法解析
    })
        .unless({path: ['/users/register']})
        // .unless({path: ['/magic/xhs']})
)

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/magic', magicRouter);
app.use('/users', userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    if (err.name === "UnauthorizedError") {
        console.log("UnauthorizedError", req.headers)
        res.status(401).json({code: 401, msg: "invalid token, plz connect the admin"});
    } else {
        next(err);
    }
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


// error handler
//检查token使用次数，如果超过或者用户不存在，不能调用接口
app.use(function (err, req, res, next) {

    next()
});


module.exports = app;

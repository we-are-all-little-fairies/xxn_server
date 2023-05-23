//参数解析错误
const PARMAS_PARSE_ERROR = {
  code: 50001,
  msg: "request params error",
};

//参数解析错误
const INTERNAL_ERROR = {
  code: 50000,
  msg: "server internal err",
};

//鉴权失败失败
//参数解析错误
const AUTH_ERROR = {
  code: 40001,
  msg: "u has not permission to access the system",
};

const NO_RETRY_TIME_ERROR = {
  code: 40002,
  msg: "u has not try times to access the system, plz connect admin",
};

//参数解析错误
const SUCCESS = {
  code: 200,
  msg: "success",
};

module.exports.HTTP_CODE = {
  PARMAS_PARSE_ERROR: PARMAS_PARSE_ERROR,
  AUTH_ERROR: AUTH_ERROR,
  SUCCESS: SUCCESS,
  INTERNAL_ERROR: INTERNAL_ERROR,
  NO_RETRY_TIME_ERROR: NO_RETRY_TIME_ERROR,
};

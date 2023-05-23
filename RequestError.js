class RequestError extends Error {
  constructor(msg) {
    super(msg || "wrong request params");
  }
}

module.exports.RequestError = RequestError;

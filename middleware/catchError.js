module.exports.catchError = (middleware) => {
  return (req, res, next) => {
    const promise = middleware(req, res, next);
    if (promise && promise.catch) {
      promise.catch(next);
    }
  };
};

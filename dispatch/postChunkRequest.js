const https = require("https");

module.exports.postChunkRequest = async (data, options, onChunk) => {
  return new Promise((resolve, reject) => {
    const request = https
      .request(options, (res) => {
        res.on("data", (chunk) => {
          actionLogger.log(chunk.toString());
          onChunk(chunk);
        });
        res.on("end", (msg) => {
          actionLogger.log("request end", msg);
          resolve();
        });
      })
      .on("error", (err) => {
        actionLogger.log("Error: ", err.message);
        reject(err);
      });

    request.write(JSON.stringify(data));
    request.end();
  });
};

const https = require("https");

module.exports.postChunkRequest = async (data, options, onChunk) => {
  return new Promise((resolve, reject) => {
    let response = "";
    const request = https
      .request(options, (res) => {
        res.on("data", (chunk) => {
          actionLogger.log(chunk.toString());
          response += chunk;
          onChunk(chunk);
        });
        res.on("end", () => {
          actionLogger.log("request end");
          resolve(response);
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

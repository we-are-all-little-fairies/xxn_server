const { RequestGPT } = require("./RequestGPT");

let https;
try {
  https = require("node:https");
} catch (err) {
  console.error("https support is disabled!", err);
}
(async () => {
  const chalk = await import("chalk");
  console.log("https load success");
})();

const requestXXHByOtherHttpserver = (
  requestParams,
  singleChunk,
  end,
  onErr
) => {
  const { prompt } = requestParams;

  const postData = JSON.stringify({
    prompt: prompt,
  });
  const options = {
    hostname: "www.wenanabc.xyz",
    port: 443,
    path: "/api/generate",
    method: "POST",
    headers: {
      authority: "www.wenanabc.xyz",
      accept: "*/*",
      "accept-language": "zh-CN,zh;q=0.9",
      "Content-Type": "application/json",
      origin: "https://www.wenanabc.xyz",
      referer: "https://www.wenanabc.xyz",
      "sec-ch-ua":
        '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "ec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
    },
  };
  let request = https
    .request(options, (res) => {
      let list = [];
      res.on("data", (chunk) => {
        actionLogger.log(chunk.toString());
        list.push(chunk);
        singleChunk(chunk);
      });
      res.on("end", (msg) => {
        // const {data} = JSON.parse(Buffer.concat(list).toString());
        actionLogger.log("request end", msg);
        end(list.toString());
      });
    })
    .on("error", (err) => {
      actionLogger.log("Error: ", err.message);
      onErr(err);
    });

  request.write(postData);
  request.end();
};

class RedRequester extends RequestGPT {
  async requestGPT(requestParams, singleChunk, end, onErr) {
    return requestXXHByOtherHttpserver(requestParams, singleChunk, end, onErr);
  }
}

module.exports.RedRequester = RedRequester;

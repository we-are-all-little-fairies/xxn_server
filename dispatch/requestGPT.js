const { postChunkRequest } = require("./postChunkRequest");

// open ai， 太贵了，以后再说
const requestOpenAi = async (content, onChunk) => {
  return postChunkRequest(
    {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content }],
      stream: true,
      user: "hongchen123",
    },
    {
      hostname: "api.openai.com",
      port: 443,
      path: "/v1/chat/completions",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " + "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",
      },
    },
    onChunk
  );
};

// 光点红, prompt 太死，淘汰了吧
const requestRed = async (prompt, onChunk) => {
  return postChunkRequest(
    { prompt },
    {
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
    },
    onChunk
  );
};

// 哈哈
const requestHaHa = async (content, onChunk) => {
  return postChunkRequest(
    {
      messages: [{ role: "user", content }],
      stream: true,
      model: "gpt-3.5-turbo",
      temperature: 1,
      presence_penalty: 0,
    },
    {
      hostname: "hi.haha.ai",
      port: 443,
      path: "/api/openai/v1/chat/completions",
      method: "POST",
      headers: {
        authority: "hi.haha.ai",
        accept: "*/*",
        "accept-language": "zh-CN,zh;q=0.9",
        "Content-Type": "application/json",
        origin: "https://hi.haha.ai",
        referer: " https://hi.haha.ai",
        "ec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "user-agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
      },
    },
    onChunk
  );
};

module.exports.requestGPT = async (prompt, onChunk) => {
  // TODO: fallback
  return requestHaHa(prompt, onChunk);
};

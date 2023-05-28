const WebSocket = require("ws");
const axios = require("axios");

const requestImage = async (content) => {
  const sendHash = () => {
    return { session_hash: "wxaebguq2t", fn_index: 2 };
  };

  const sendData = () => {
    return {
      fn_index: 2,
      data: [content],
      session_hash: "wxaebguq2t",
    };
  };

  return new Promise((resolve, reject) => {
    const ws = new WebSocket(
      "wss://runwayml-stable-diffusion-v1-5.hf.space/queue/join"
    );

    ws.on("error", function onError(error) {
      console.error(error);
      reject(error);
    });

    ws.on("open", function open() {});

    ws.on("message", function message(data) {
      const json = JSON.parse(data);
      console.log("received: %s", json);

      switch (json.msg) {
        case "send_hash":
          ws.send(JSON.stringify(sendHash()));
          break;
        case "send_data":
          ws.send(JSON.stringify(sendData()));
          break;
        case "process_completed":
          if (json.output.data) {
            resolve(json.output.data.shift());
          } else {
            reject(json);
          }
          break;
      }
    });
  });
};

const requestOpenjourney = async (inputs) => {
  const response = await axios.post(
    "https://api-inference.huggingface.co/models/prompthero/openjourney",
    {
      inputs,
    },
    {
      headers: {
        Authorization: "Bearer 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",
        "content-type": "application/json",
      },
      responseType: "arraybuffer",
    }
  );

  const imageBytes = Buffer.from(response.data, "binary");
  const base64Image = imageBytes.toString("base64");
  const mimeType = response.headers["content-type"];
  const base64Src = `data:${mimeType};base64,${base64Image}`;
  return [base64Src];
};

module.exports = {
  requestImage,
  requestOpenjourney,
};

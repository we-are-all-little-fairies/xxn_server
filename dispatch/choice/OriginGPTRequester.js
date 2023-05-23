const { Configuration, OpenAIApi } = require("openai");
const { RequestGPT } = require("./RequestGPT");

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

const requestXXN = async (content, singleChunk, end, onErr) => {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "你是小红书爆款写作专家，每次创作，首先产出 5 个标题（含适当的 emoji 表情），其次产出 1 个正文（每一个段落含有适当的 emoji 表情，文末有合适的 tag 标签）",
      },
      {
        role: "user",
        content: content,
      },
    ],
    user: "hongchen123",
  });
  console.log(completion.data.choices[0].message);
  singleChunk(completion.data.choices[0].message);
  end(completion.data.choices[0].message);
  return completion.data.choices[0].message;
};

class OriginGPTRequester extends RequestGPT {
  async requestGPT(requestParams, singleChunk, end, onErr) {
    return requestXXN(requestParams, singleChunk, end, onErr);
  }
}

module.exports.OriginGPTRequester = OriginGPTRequester;

const {RequestGPT} = require("./RequestGPT");

let https;
try {
    https = require('node:https');
} catch (err) {
    console.error('https support is disabled!', err);
}
(async () => {
    const chalk = await import("chalk")

    console.log('success');
})();

/**
 * https://hi.haha.ai/#/chat
 *
 *
 */

//curl 'https://hi.haha.ai/api/openai/v1/chat/completions' \
//   -H 'authority: hi.haha.ai' \
//   -H 'accept: */*' \
//   -H 'accept-language: zh-CN,zh;q=0.9' \
//   -H 'content-type: application/json' \
//   -H 'origin: https://hi.haha.ai' \
//   -H 'referer: https://hi.haha.ai/' \
//   -H 'sec-fetch-dest: empty' \
//   -H 'sec-fetch-mode: cors' \
//   -H 'sec-fetch-site: same-origin' \
//   -H 'user-agent: Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1' \
//   --data-raw '{"messages":[{"role":"system","content":"你好，我是小红书写手，我的任务是以小红书博主的文章结构，用你给出的主题写一篇帖子推荐。我的回答包括使用表情符号来增加趣味和互动，以及与每个段落相匹配的图片。我将以一个引人入胜的介绍开始，然后提供至少三个与主题相关的段落，突出它们的独特特点和吸引力。在我的写作中使用表情符号，使它更加引人入胜和有趣。对于每个段落，我会提供一个与描述内容相匹配的图片，这些图片会在视觉上吸引人，帮助使得描述更加生动形象。"},{"role":"user","content":"今天真是个好天气\n"}],"stream":true,"model":"gpt-3.5-turbo","temperature":1,"presence_penalty":0}' \
//   --compressed
class HAHARequester extends RequestGPT {
    async requestGPT(requestParams, singleChunk, end, onErr) {

        const {prompt} = requestParams;

        const postData = JSON.stringify({
                messages: [
                    {
                        role: "system",
                        content: "你是小红书爆款写作专家，每次创作，首先产出 5 个标题（含适当的 emoji 表情），其次产出 1 个正文（每一个段落含有适当的 emoji 表情，文末有合适的 tag 标签）"
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                stream: true,
                model: "gpt-3.5-turbo",
                temperature: 1,
                presence_penalty: 0
            }
        );
        const options = {
            hostname: 'hi.haha.ai',
            port: 443,
            path: '/api/openai/v1/chat/completions',
            method: 'POST',
            headers: {
                'authority': 'hi.haha.ai',
                'accept': '*/*',
                'accept-language': 'zh-CN,zh;q=0.9',
                'Content-Type': 'application/json',
                'origin': 'https://hi.haha.ai',
                'referer': ' https://hi.haha.ai',
                'ec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
            },
        };
        let request = https.request(options, res => {

            let list = [];
            res.on('data', chunk => {
                actionLogger.log(chunk.toString())
                list.push(chunk);
                singleChunk(chunk)
            });
            res.on('end', (msg) => {
                actionLogger.log("request end", msg)
                end(list.toString())
            });

        }).on('error', err => {
            actionLogger.log('Error: ', err.message);
            onErr(err)
        });

        request.write(postData)
        request.end()
    }
}

module.exports.HAHARequester = HAHARequester
let https;
try {
    https = require('node:https');
} catch (err) {
    console.error('https support is disabled!');
}
(async () => {
    const chalk = await import("chalk")

    console.log('success');
})();

const requestXXHByOtherHttpserver = (requestParams, singleChunk, end, onErr) => {

    const {theme, people, require, voice, hot} = requestParams

    const postData = JSON.stringify({
            prompt: `1、主题：${theme}\\n2、你的受众人群：${people}\\n3、受众对于我们产品的需求：${require}\\n4、表达语气：${voice}\\n5、热点结合：${hot}`
        }
    );
    const options = {
        hostname: 'www.wenanabc.xyz',
        port: 443,
        path: '/api/generate',
        method: 'POST',
        headers: {
            'authority': 'www.wenanabc.xyz',
            'accept': '*/*',
            'accept-language': 'zh-CN,zh;q=0.9',
            'Content-Type': 'application/json',
            'origin': 'https://www.wenanabc.xyz',
            'referer': 'https://www.wenanabc.xyz',
            'sec-ch-ua': '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'ec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36'
        },
    };
    let request = https.request(options, res => {
        let list = [];
        res.on('data', chunk => {
            console.log(chunk.toString())
            list.push(chunk);
            singleChunk(chunk)
        });
        res.on('end', () => {
            // const {data} = JSON.parse(Buffer.concat(list).toString());
            end(list.toString())
        });
    }).on('error', err => {
        console.log('Error: ', err.message);
        onErr(err)
    });

    request.write(postData)
    request.end()

}

module.exports.requestXXHByOtherHttpserver = requestXXHByOtherHttpserver

//const curl = 'curl \'https://www.wenanabc.xyz/api/generate\' \\\n' +
//     '  -H \'authority: www.wenanabc.xyz\' \\\n' +
//     '  -H \'accept: */*\' \\\n' +
//     '  -H \'accept-language: zh-CN,zh;q=0.9\' \\\n' +
//     '  -H \'content-type: application/json\' \\\n' +
//     '  -H \'origin: https://www.wenanabc.xyz\' \\\n' +
//     '  -H \'referer: https://www.wenanabc.xyz/\' \\\n' +
//     '  -H \'sec-ch-ua: "Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"\' \\\n' +
//     '  -H \'sec-ch-ua-mobile: ?0\' \\\n' +
//     '  -H \'sec-ch-ua-platform: "macOS"\' \\\n' +
//     '  -H \'sec-fetch-dest: empty\' \\\n' +
//     '  -H \'sec-fetch-mode: cors\' \\\n' +
//     '  -H \'sec-fetch-site: same-origin\' \\\n' +
//     '  -H \'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36\' \\\n' +
//     '  --data-raw \'{"prompt":"1、主题：小红书爆款生成器\\n2、你的受众人群：自媒体\\n3、受众对于我们产品的需求：用户体验\\n4、表达语气：惊讶\\n5、热点结合：aigc"}\' \\\n' +
//     '  --compressed'
// const {https} = require('https')
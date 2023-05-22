const WebSocket = require('ws');
const {RequestGPT} = require("./RequestGPT");


function generatePics(content, success, err) {
    const ws = new WebSocket('wss://runwayml-stable-diffusion-v1-5.hf.space/queue/join');

    ws.on('error', function onError(error) {
        console.error(error)
        err(error)
    });

    ws.on('open', function open() {
    });

    ws.on('message', function message(data) {
        let json = JSON.parse(data)
        console.log('received: %s', json);

        switch (json.msg) {
            case "send_hash":
                ws.send(JSON.stringify(sendHash()))
                break
            case "send_data":
                ws.send(JSON.stringify(sendData()))
                break
            case "process_completed":
                success(json)
                break
        }
    });

    function sendHash() {
        return {"session_hash": "wxaebguq2t", "fn_index": 2}
    }

    function sendData() {
        return {
            "fn_index": 2,
            "data": [content],
            "session_hash": "wxaebguq2t"
        }
    }
}

class AIPicsRequester extends RequestGPT {
    async requestGPT(requestParams, singleChunk, end, onErr) {
        generatePics(requestParams, end, onErr)
    }
}

module.exports.AIPicsRequester = AIPicsRequester

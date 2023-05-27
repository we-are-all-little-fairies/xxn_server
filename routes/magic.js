const express = require("express");
const router = express.Router();
const { catchError } = require("../middleware/catchError");
const { RequestError } = require("../RequestError");
const { requestGPT } = require("../dispatch/requestGPT");
const { requestImage } = require("../dispatch/requestImage");
const {
  refineTemplete,
  generateTemp,
  titleImageTemplete,
  img2prompt,
} = require("../templetes/xhsTempletes");
// const { retryHandler } = require("../middleware/retryHandler");

router.post(
  "/xhs",
  // retryHandler,
  catchError(async (req, res) => {
    if (!req.body.prompt) {
      throw new RequestError("no content params");
    }

    const content = generateTemp + req.body.prompt;
    await requestGPT(content, (chunk) => {
      res.write(chunk);
    });
    res.end();
    // decreaseTryTime(req.auth.user);
  })
);

router.post(
  "/xhs/refine",
  // retryHandler,
  catchError(async (req, res) => {
    if (!req.body.lastResult || !req.body.lastPrompt) {
      throw new RequestError("no content params");
    }

    await requestGPT(
      refineTemplete(req.body.lastPrompt, req.body.lastResult, req.body.prompt),
      (chunk) => {
        res.write(chunk);
      }
    );
    res.end();
    // decreaseTryTime(req.auth.user);
  })
);

router.post(
  "/generate/pics",
  // retryHandler,
  catchError(async (req, res) => {
    if (!req.body.prompt) {
      throw new RequestError("no content params");
    }

    let sdPrompt = JSON.parse(
      await requestGPT(titleImageTemplete + req.body.prompt, () => {}, {
        stream: false,
      })
    ).choices[0].message.content;

    console.log(sdPrompt);

    sdPrompt = JSON.parse(
      await requestGPT(img2prompt + sdPrompt, () => {}, {
        stream: false,
      })
    ).choices[0].message.content;

    console.log(sdPrompt);

    const data = await requestImage(sdPrompt);

    res.json({
      data,
    });

    // decreaseTryTime(req.auth.user)
  })
);

module.exports = router;

const express = require("express");
const router = express.Router();
const { generateTemp } = require("../templetes/xhsTempletes");
const { catchError } = require("../middleware/catchError");
const { RequestError } = require("../RequestError");
const { requestGPT } = require("../dispatch/requestGPT");
const { requestImage } = require("../dispatch/requestImage");
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

    const data = await requestImage(req.body.prompt);

    res.json({
      data,
    });

    // decreaseTryTime(req.auth.user)
  })
);

module.exports = router;

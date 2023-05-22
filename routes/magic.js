var express = require('express');
var router = express.Router();
const requestXXN = require('../dispatch/choice/OriginGPTRequester')


const {HTTP_CODE} = require("../HTTP_CODE");
const {findUser, decreaseTryTime} = require("../db/interfaces/users");
const {RequestFactory, QuestType} = require("../dispatch/RequestFactory");

const testJSON = {
    role: 'assistant',
    content: '标题1：🍛一些关于咖喱牛腩的秘密，你知道吗？\n' +
        '标题2：🥘咖喱牛腩，家庭晚餐的完美选择！\n' +
        '标题3：👌这些咖喱牛腩的做法，让你吃到想哭！\n' +
        '标题4：🔥大胆尝试，不一样的咖喱牛腩食谱！\n' +
        '\n' +
        '正文：\n' +
        '\n' +
        '咖喱牛腩自问世以来就备受瞩目和爱戴，为什么咖喱牛腩这么受欢迎呢？建议您亲身去品尝一番，肯定不虚此行。咖喱牛腩是一道口感鲜嫩、配合咖喱佐料，变得那般香辣可口。常说良好的饮食是基本的，那如果什么吃进肚里是那么费心费力，那还不如来一道简单易做的咖喱牛' +
        '\n' +
        '如何制作一道口感鲜美的咖喱牛腩呢？下面我就来为大家介绍一些小技巧，让您也可以制作出一道什么也不输于大厨的美味佳肴：\n' +
        '\n' +
        '1. 炒香咖喱粉\n' +
        '\n' +
        '在煸炒牛腩之前，先将咖喱粉放入炒锅中炒香，相信您一定能够闻到一股浓郁的咖喱味，这样烹调出来的咖喱牛腩的香味更浓，口感也更佳。\n' +
        '\n' +
        '2. 合理选用牛腩\n' +
        '\n' +
        '最好选择含有五花肉和筋的牛腩，这样的牛腩脂肪大、筋多，炖煮时更容易软烂入味。\n' +
        '\n' +
        '3. 尝试加入蔬菜调味\n' +
        '\n' +
        '除了咖喱、盐巴等调味品，您可以尝试加入适量的胡萝卜、洋葱，多种蔬菜的加入会增色不少，同时还可以增添独特的口感。\n' +
        '\n' +
        '最后，如果您想要更多人了解这道美味的咖喱牛腩，不妨附上这样的标签：#美食分享#咖喱牛腩#懒人厨房#下厨不难#家庭晚餐#'
}

/* GET users listing. */
router.post('/bypass', function (req, res, next) {
    // res.json(testJSON)
    // return


    if (!req.body) {
        res.json({
            err: 400,
            msg: "no content params"
        })

        return
    }
    new RequestFactory(QuestType.HAHA).conductChoice().requestGPT(req.body, (chunk) => {
            res.write(chunk)
        },
        (end) => {
            res.end()
            // decreaseTryTime(req.auth.user)
        },
        (error) => {
            res.json({
                ...HTTP_CODE.INTERNAL_ERROR,
                detail: error
            })
        })
});

/* GET users listing. */
router.post('/xhs', function (req, res, next) {

    if (!req.body.prompt) {
        res.json({
            err: 400,
            msg: "no content params"
        })

        return
    }


    new RequestFactory(QuestType.RED).conductChoice().requestGPT(req.body,
        (chunk) => {
            res.write(chunk)
        },
        (end) => {
            res.end()
            // decreaseTryTime(req.auth.user)
        },
        (error) => {
            res.json({
                ...HTTP_CODE.INTERNAL_ERROR,
                detail: error
            })
        }
    )

    // if (!req.auth) {
    //     return res.json(
    //         HTTP_CODE.AUTH_ERROR
    //     )
    // }

    //检查用户是否在数据库中，在数据库中，并且retry大于0，才可以请求接口
    // findUser(req.auth.user)
    //     .then(user => {
    //         dbLogger.info("find user success", user)
    //         if (user == null) {
    //             return res.json(
    //                 HTTP_CODE.AUTH_ERROR
    //             )
    //         }
    //
    //         if (!user.retry || user.retry <= 0) {
    //             return res.json(
    //                 HTTP_CODE.NO_RETRY_TIME_ERROR
    //             )
    //         }
    //
    //
    //         requestXXHByOtherHttpserver(req.body,
    //             (chunk) => {
    //                 res.write(chunk)
    //             },
    //             (end) => {
    //                 res.end()
    //                 decreaseTryTime(req.auth.user)
    //             },
    //             (error) => {
    //                 res.json({
    //                     ...HTTP_CODE.INTERNAL_ERROR,
    //                     detail: error
    //                 })
    //             }
    //         )
    //
    //     })
    //     .catch(err => {
    //         dbLogger.error("find user failed", err)
    //         res.json({
    //             ...HTTP_CODE.INTERNAL_ERROR,
    //             detail: err
    //         })
    //     })


});


module.exports = router;

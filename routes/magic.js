var express = require("express");
var router = express.Router();
const requestXXN = require("../dispatch/choice/OriginGPTRequester");

const { HTTP_CODE } = require("../HTTP_CODE");
const { findUser, decreaseTryTime } = require("../db/interfaces/users");
const { RequestFactory, QuestType } = require("../dispatch/RequestFactory");

const testJSON = {
  role: "assistant",
  content:
    "标题1：🍛一些关于咖喱牛腩的秘密，你知道吗？\n" +
    "标题2：🥘咖喱牛腩，家庭晚餐的完美选择！\n" +
    "标题3：👌这些咖喱牛腩的做法，让你吃到想哭！\n" +
    "标题4：🔥大胆尝试，不一样的咖喱牛腩食谱！\n" +
    "\n" +
    "正文：\n" +
    "\n" +
    "咖喱牛腩自问世以来就备受瞩目和爱戴，为什么咖喱牛腩这么受欢迎呢？建议您亲身去品尝一番，肯定不虚此行。咖喱牛腩是一道口感鲜嫩、配合咖喱佐料，变得那般香辣可口。常说良好的饮食是基本的，那如果什么吃进肚里是那么费心费力，那还不如来一道简单易做的咖喱牛" +
    "\n" +
    "如何制作一道口感鲜美的咖喱牛腩呢？下面我就来为大家介绍一些小技巧，让您也可以制作出一道什么也不输于大厨的美味佳肴：\n" +
    "\n" +
    "1. 炒香咖喱粉\n" +
    "\n" +
    "在煸炒牛腩之前，先将咖喱粉放入炒锅中炒香，相信您一定能够闻到一股浓郁的咖喱味，这样烹调出来的咖喱牛腩的香味更浓，口感也更佳。\n" +
    "\n" +
    "2. 合理选用牛腩\n" +
    "\n" +
    "最好选择含有五花肉和筋的牛腩，这样的牛腩脂肪大、筋多，炖煮时更容易软烂入味。\n" +
    "\n" +
    "3. 尝试加入蔬菜调味\n" +
    "\n" +
    "除了咖喱、盐巴等调味品，您可以尝试加入适量的胡萝卜、洋葱，多种蔬菜的加入会增色不少，同时还可以增添独特的口感。\n" +
    "\n" +
    "最后，如果您想要更多人了解这道美味的咖喱牛腩，不妨附上这样的标签：#美食分享#咖喱牛腩#懒人厨房#下厨不难#家庭晚餐#",
};

const xhsTemplete = `从现在开始，你是一个小红书文案助手，你会根据用户所提供的内容和要求来写作。你的写作风格应该符合小红书的风格：
1.以亲身经历和实际操作为基础,注重详细的描述和实用的建议，以帮助其他用户更好地了解和应用这些知识
2.必须在标题和正文使用大量emoji，尽可能的连续使用多个emoji
3.尽可能的在文案中加入插图，并通过 [插图：你所建议的插图内容] 给出插图建议
你需要在返回的结果中给出至少3个标题的建议，并在标题后面通过 "正文:" 来分割标题和正文

下面是一个例子:
Q：20岁少女穿搭

A:
标题:
💃🛍️👀收！流行的 20 岁少女穿搭一定要看！| 时尚穿搭一秒 UP |
👗👢别问我为什么 20 岁的我穿成这样，问就是颜值高！| 少女走秀穿搭 |
👀👕👚看这里！这些 20 岁少女穿搭让你get「清新文艺范儿」| 穿搭攻略 |

正文:
👀你好呀！今天给大家带来的是 20 岁少女的穿搭分享，一秒 UP 时尚指数！
💃作为 20 岁的我们，又处于人生的这个黄金时期，怎么能落后于潮流呢！这些穿搭一定要get啊！
🛍️首先推荐的是「清新文艺范儿」，穿上这样的衣服，就能穿出小清新的感觉，让你立刻减龄。例如选择一个清新的连衣裙，再搭配一个小号的包包和运动鞋，让你立马变成走在街头的小仙女。
[插图：一位时尚青春的少女穿着连衣裙站在街头，自信而充满活力]
👗👢其次是少女走秀穿搭，主要是能够体现自己的个性，特点是很有活力！能够让你看起来更有精神。推荐使用色彩鲜艳的上衣，加上一双精致的高跟鞋，甚至选择一个收腰设计的半身裙，让你在每个角度都拥有完美身材。
[插图：一位都市丽人踩着高跟鞋，穿着半身裙摆着 pose]
👑最后是今季潮流穿搭，最近天气也越来越好了。春季卫衣逐渐从我们的衣橱中退下，逐渐换装成薄外套，宽松裤就是关键，你可以选择高腰的宽松裤和一件短款的夹克，让你在街上散发自信的气息！
[插图：少女穿着宽松裤和短夹克自信的在走路]
👀那就这样啦，今天为大家带来的 20 岁少女穿搭分享，都是相当有用的哦，赶紧把它们放进你的衣橱给自己添点儿潮流色彩吧！
标签：少女穿搭、时尚攻略、穿搭分享、搭配技巧

以下用户的输入:
`;

/* GET users listing. */
router.post("/bypass", function (req, res, next) {
  // res.json(testJSON)
  // return

  if (!req.body) {
    res.json({
      err: 400,
      msg: "no content params",
    });

    return;
  }
  new RequestFactory(QuestType.HAHA).conductChoice().requestGPT(
    req.body,
    (chunk) => {
      res.write(chunk);
    },
    (end) => {
      res.end();
      // decreaseTryTime(req.auth.user)
    },
    (error) => {
      res.json({
        ...HTTP_CODE.INTERNAL_ERROR,
        detail: error,
      });
    }
  );
});

/* GET users listing. */
router.post("/xhs", function (req, res, next) {
  if (!req.body.prompt) {
    res.json({
      err: 400,
      msg: "no content params",
    });

    return;
  }

  const content = xhsTemplete + req.body.prompt;

  new RequestFactory(QuestType.HAHA).conductChoice().requestGPT(
    {
      messages: [
        {
          role: "user",
          content,
        },
      ],
      stream: true,
      model: "gpt-3.5-turbo",
      temperature: 1,
      presence_penalty: 0,
    },
    (chunk) => {
      res.write(chunk);
    },
    (end) => {
      res.end();
      // decreaseTryTime(req.auth.user)
    },
    (error) => {
      res.json({
        ...HTTP_CODE.INTERNAL_ERROR,
        detail: error,
      });
    }
  );

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

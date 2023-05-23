var express = require("express");
var router = express.Router();
const requestXXN = require("../dispatch/choice/OriginGPTRequester");

const { HTTP_CODE } = require("../HTTP_CODE");
const { findUser, decreaseTryTime } = require("../db/interfaces/users");
const { RequestFactory, QuestType } = require("../dispatch/RequestFactory");
const { generatePics } = require("../dispatch/choice/AIPicsRequester");

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

router.post("/generate/pics", function (req, res, next) {
  // res.json(testJSON)
  // return

  if (!req.body.prompt) {
    res.json({
      err: 400,
      msg: "no prompt params",
    });

    return;
  }

  new RequestFactory(QuestType.AI_PICS).conductChoice().requestGPT(
    req.body.prompt,
    (chunk) => {},
    (end) => {
      res.json({
        ...HTTP_CODE.SUCCESS,
        data: end.shift(),
      });
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

module.exports = router;

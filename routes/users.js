var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
const {insertUser} = require("../db/interfaces/users");
const {HTTP_CODE} = require("../HTTP_CODE");

const GOD_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Im5hbWUiOiJ6cyIsInBhc3N3b3JkIjoxMjN9LCJpYXQiOjE2ODQzOTI4NDcsImV4cCI6MTY4NDQ3OTI0N30.awkjAJhLorZNIqfPCv4LGu0jjMfO2SheUzODt-LqFfA"
/* GET users listing. */
router.post('/register', function (req, res, next) {

    //只有带了上帝token的才可以注册用户

    if (req.header('authorization') !== GOD_TOKEN) {
        return res.json(HTTP_CODE.AUTH_ERROR)
    }

    if (!req.body.name || !req.body.password) {
        return res.json(HTTP_CODE.PARMAS_PARSE_ERROR)
    }


    const token = jwt.sign(
        {user: {name: req.body.name, password: req.body.password}},
        SECRET_KEY,
        {expiresIn: '7d'}
    )

    actionLogger.info('🚀 → token', token)

    insertUser(req.body.name, req.body.password, token)
        .then((dbres) => {
            //存db
            res.json({
                ...HTTP_CODE.SUCCESS,
                token,
            })
        })
        .catch(err => {
            res.json(
                {
                    ...HTTP_CODE.INTERNAL_ERROR,
                    detail: err
                }
            )
        })


});

module.exports = router
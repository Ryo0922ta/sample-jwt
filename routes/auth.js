const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const { User } = require("../db/User");
const config = require("../config");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");


// エンドぽイントはserver.jsで指定しているから
// get("/") ->  パスは「auth/」を指している

router.get("/", (req, res) => {
    res.send("hello Authjs");
});

//ユーザ新期登録　１：ユーザーからの入力
router.post("/register",
    // test用、isEmail()は判定がむずすぎる
    // ２：バリデーションチェック
    check('email').contains("@"),
    check('password').notEmpty().isLength({ min: 5 }),
    // awit 使うならここをasyncにしないといけない
    async (req, res) => {
        const errors = validationResult(req);
        // 空でないつまりエラーが入っている
        if (!errors.isEmpty()) {
            res.status(400).send({ errors: errors.array() });
        }
        // res.send('Validation successful!'); //res が返された後にres を返すことはできない

        const email = req.body.email;  //shift option でコピーして下の行に追加
        const password = req.body.password;

        // console.log(email);
        // console.log(password);

        // ３： DBにユーザーがいるか確認する
        const user = User.find((user) => user.email === email);
        if (user) {
            return res.status(400).json([
                {
                    message: "すでにそのユーザは存在しています。",
                }
            ]);
        }
        // ４：パスワードの暗号化 npm install bcrypt  ビークリプト
        // soltについて
        let hashedpassword = await bcrypt.hash(password, 10);
        // console.log(hashedpassword);

        // ５：DBへの保存(※擬似的に)
        User.push({
            email,
            password: hashedpassword,
        });
        // console.log(User);

        /*
        トークンとは　遊園地ならチケット買って入場するだろう
        買ったユーザが一度その遊園地から出てもう一度入り直すときにまた購入の手続きを取るのはめんどくさい
        なので代わりに特別なチケット（トークン）を渡しますので次回はこれで入場して来てくださいとする
        登録されたユーザの出入りがスムーズになる
        */

        // クライアントへjwtの発行
        // secretkey 誰にも見せてはいけない
        // expiresIn どれくらい保存するの 
        // トークン発行したらどこに保存しておく？
        // ローカルストレージはよくないクッキーに保存するのが良い
        // XSS攻撃を受ける可能性がものすごくたかい

        const payload = {
            email: req.body.email,
            password: req.body.password,
        };

        const token = JWT.sign(payload, config.jwt.secret, config.jwt.options);

        // console.log(email, password);
        // return res.send("auth ok");
        return res.json({
            token: token,
        });

    });

// ログインのテスト
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = User.find((user) => user.email === email);

    if (!user) {
        return res.status(400).json([
            {
                msg: "そのユーザーは存在しません",
            },
        ]);
    }

    //パスワード照合
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).json([
            {
                msg: "パスワードが違います",
            },
        ]);
    }

    const payload = {
        email: req.body.email,
        password: req.body.password,
    };

    const token = JWT.sign(payload, config.jwt.secret, config.jwt.options);

    return res.json({
        token: token,
    });
});



// DBのユーザを確認するテストAPI
router.get("/allUsers", (req, res) => {
    return res.json(User);
});

module.exports = router;


const JWT = require("jsonwebtoken");
const config = require("../config");

module.exports = (req, res, next) => {

    //JWTを持っているか確認 -> リクエストヘッダの中のx-auth-tokenを確認
    // ここがクッキーから取り出すところになるのか？
    const token = req.header("x-auth-token");

    // const userVaild = false;
    // const userVaild = true;

    if (!token) {
        res.status(400).json({
            msg: "権限がありません",
        });
    } else {

        try {

            let user = JWT.verify(token, config.jwt.secret);
            req.user = user.email;
            // ミドルウェアを抜ける　※の処理に処理が移る
            next();
        } catch {
            return res.status(400).json([
                {
                    msg: "tokenが一致しません",
                },
            ]);
        }
    }
};

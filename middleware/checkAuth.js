const JWT = require("jsonwebtoken");
const config = require("../config");

module.exports = (req, res, next) => {

//   認証情報からjwtのトークンを取得
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];

    if (!authHeader) {
        return res.status(401).send('Access denied: No token provided');
    }

    try {

        const decoded = JWT.verify(token, config.jwt.secret);
        req.user = decoded;
        // ミドルウェアを抜ける　※の処理に処理が移る
        next();
    } catch (error) {
        res.status(400).send("ユーザ情報が得られませんでした。");
    }

};

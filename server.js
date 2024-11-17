const express = require("express");
const app = express();
const PORT = 3010;
const auth = require("./routes/auth");
const post = require("./routes/post");


// express.json()を加えないとサーバー側がjsonに対応しないので
// json形式でpostしてもエラーになる（Cannot read propeerties of undifined）
app.use(express.json());
app.use("/auth", auth);
app.use("/article", post);


// エンドポイントを指定してそのポイントに対して　どんなレスポンスを返すか決める
app.get("/", (req, res) => {
    res.send("hello Express");
});

app.listen(PORT, () => {

    console.log("starting server....");

});

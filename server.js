const express = require("express");
const app = express();
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const uploadRoute = require("./routes/upload");
const PORT = 8000;
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

//データベース接続
mongoose
//パスワードを含んだ大事なURLを秘密裏して、保守性・堅牢度を上げる
    .connect(
        process.env.MONGOURL
    )
    .then(() => {
        console.log("DBと接続中...");
    })
    .catch((err) => {
        console.log(err)
    });

//ルートディレクトリ
app.get("/", (req, res) => {
    res.send("hello express")
});

//ミドルウェア
// 第1引数：デフォルトのエンドポイント
// 第2引数： api/usersを/に指定
//エンドポイントを見ればどういうルーティング設定かが分かりやすい

// 「/images」を見に行った時、静的なファイルに関しては、現在のディレクトリ+「public/images」を見てください
app.use("/images", express.static(path.join(__dirname, "public/images")));

//これから使うデータは全てJSON形式であるという宣言
app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
// app.use("/api/upload", uploadRoute);

// app.get("/" (req, res) => {
//     res.send("hello express");
// })

//Serve static assets if in production
if(process.env.NODE_ENV === 'production') {
    //Set static folder
    app.use(express.static('frontend/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
}


//ローカルサーバーを立ち上げる
app.listen(process.env.PORT || PORT, () => console.log('サーバーが起動しました'));
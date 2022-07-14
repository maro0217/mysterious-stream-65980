const router = require("express").Router();
const User = require("../models/User")

//Router()にルーティング設定を行える

//ユーザー登録
router.post("/register", async (req, res) => {
    //エラーハンドリング
    try {
        const newUser = await new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });

        //save関数によって保存
        const user = await newUser.save();
        //保存の成功をステータスコードで通知
        return res.status(200).json(user);
    } catch (err) {
        //サーバー関連のエラーをjson形式で返す
        return res.status(500).json(err);
    }
});

//ログイン
router.post("/login", async (req, res) => {
    try {
        //ログインしたユーザーがどのユーザーかを捜してくる
        // emailを打ち込んで、そのemailを含むユーザーを探してくる
        const user = await User.findOne({ email: req.body.email });
        if(!user) return res.status(404).send("ユーザーが見つかりません");


        
        const vailedPassword = req.body.password === user.password;
        if(!vailedPassword) return res.status(400).json("パスワードが違います");

        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json(err);
    }
})

// router.get("/", (req, res) => {
//     res.send("auth router")
// })

module.exports = router;

const router = require("express").Router();
//Router()にルーティング設定を行える
const User = require("../models/User")

//CRUD
//ユーザー情報の更新
// 「/:id」で任意のidを指定
router.put("/:id", async(req, res) => {
    //useridの照合 params（今ログインしているユーザー）ってどこから？isAdminとは？
    if(req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            //mongooseのメソッド。ひとつのユーザーを見つけてそれを更新する
            //第一引数：どのユーザーを更新するのか
            //第二引数：どういう風に変更するのか
            const user = await User.findByIdAndUpdate(req.params.id, {
                // $すべてのパラメータを「$set」で指定→postmanの「req.body」で書き換える
                $set: req.body
            });
            return res.status(200).json("ユーザー情報が更新されました");
        } catch(err) {
            return res.status(500).json(err)
        }

    } else {
        return res.status(403).json("あなたは自分のアカウントの時のみ情報を更新できます")
    }
})

//ユーザー情報の削除
router.delete("/:id", async(req, res) => {
    //useridの照合 params（今ログインしているユーザー）ってどこから？isAdminとは？
    //自分のidだけ削除できる
    if(req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            //mongooseのメソッド。ひとつのユーザーを見つけてそれを削除する
            //第一引数：どのユーザーを削除するのか
            //第二引数：更新する必要がないのでいらない
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("ユーザー情報が削除されました");
        } catch(err) {
            return res.status(500).json(err)
        }

    } else {
        return res.status(403).json("あなたは自分のアカウントの時のみ情報を削除できます")
    }
})

//ユーザー情報の取得
//タイムラインの表示など。第三者でも見れる
// router.get("/:id", async(req, res) => {

//         try {
//             //単純なユーザー情報の取得
//             const user = await User.findById(req.params.id);

//             //ユーザー情報にあるpasswordなどを取り出している（分割代入）
//             const {password, updatedAt, ...other} = user._doc;
//             //password updatedAtを抜き取った情報を取り出せる
            
//             res.status(200).json(other);
//         } catch(err) {
//             return res.status(500).json(err)
//         }
// });

//クエリでユーザー情報を取得
//ルートディレクトリにすることでクエリが使える
router.get("/", async(req, res) => {

    // URL　＝　「~/~/~?userId=クエリが見るランダムなID」(req.query.userID)
    // URL　＝　「~/~/~?username=クエリが見る名前」(req.query.username)
        const userId = req.query.userId;
        const username = req.query.username;

        try {
            //Idがなければusernameでmodelsから捜してくる。　　　　//findOne({ mongodbのusername: 上の変数username })
            const user = userId
             ? await User.findById(userId)
             : await User.findOne({ username: username });

            
            //ユーザー情報にあるpasswordなどを取り出している（分割代入）
            const {password, updatedAt, ...other} = user._doc;
            //password updatedAtを抜き取った情報を取り出せる
            
            return res.status(200).json(other);
            
        } catch(err) {
            return res.status(500).json(err)
        }
});

//ユーザーのフォロー
//putは情報を更新するメソッド
//「:id」はこれからフォローするユーザーのid
router.put("/:id/follow", async (req, res) => {
    //ユーザーをフォローする条件「自身のidとフォローするidが一致しない」かつ「自身が相手のユーザーをフォローしていない」
    if(req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            
            //「user.followers」=ユーザースキーマに含まれている「followers」
            //includesメソッドで、今からフォローするユーザーのfollowersに自身のidが入っていなければfalseを返すので、!でtrue
            //フォローが可能になる
            if(!user.followers.includes(req.body.userId)) {
          //updateOneはmongooseのメソッド
                await user.updateOne({
                    //相手のfollowers配列に自分を格納
                    $push: {
                        followers: req.body.userId,
                    }
                    //自分のfollowing配列に自分を格納
                });
                await currentUser.updateOne({
                    $push: {
                        following: req.params.id,
                    }
                });
                return res.status(200).json("フォローに成功しました！");
            } else {
                return res.status(403).json("フォロー済み")
            }
        } catch(err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(500).json("自分自身をフォローできません");
    }
});

//ユーザーのアンフォロー
router.put("/:id/unfollow", async (req, res) => {
    //ユーザーをフォローする条件「自身のidとフォローするidが一致しない」かつ「自身が相手のユーザーをフォローしていない」
    if(req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            
            //「user.followers」=ユーザースキーマに含まれている「followers」
            //相手のフォロワーに自分がいたら、フォローを外せる
            if(user.followers.includes(req.body.userId)) {
          //updateOneはmongooseのメソッド
                await user.updateOne({
                    //相手のfollowers配列に自分を格納
                    $pull: {
                        followers: req.body.userId,
                    }
                    //自分のfollowing配列に自分を格納
                });
                await currentUser.updateOne({
                    $pull: {
                        followings: req.params.id,
                    }
                });
                return res.status(200).json("フォロー解除しました！");
            } else {
                return res.status(403).json("このユーザーはフォロー解除できません")
            }
        } catch(err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(500).json("自分自身をフォロー解除できません");
    }
});



// router.get("/", (req, res) => {
//     res.send("user router")
// })

module.exports = router;


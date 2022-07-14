const router = require("express").Router();
//Router()にルーティング設定を行える
const Post = require("../models/Post");
const User = require("../models/User");


//投稿を作成する
router.post("/", async (req, res) => {

    //Postスキーマをインスタンス化
    const newPost = new Post(req.body);
    try {
        //正常にtryであれば保存される
        const savedPost = await newPost.save();
        return res.status(200).json(savedPost)
    } catch(err) {
        return res.status(500).json(err);
    } 
});

//投稿を編集する
//postした固有のidを指定
router.put("/:id", async (req, res) => {

    try {
        const post = await Post.findById(req.params.id);
        //指定した投稿のユーザーidと、現在のユーザーidと一致すれば編集可能
        if (post.userId === req.body.userId) {
            await post.updateOne({
                $set: req.body,
            });
            return res.status(200).json("投稿編集に成功しました！");
        } else {
            return res.status(403).json("あなたは他の人の投稿を編集できません");
        }
    } catch(err) {
        return res.status(403).json(err);
    } 
});

//投稿削除
router.delete("/:id", async (req, res) => {

    try {
        const post = await Post.findById(req.params.id);
        //指定した投稿のユーザーidと、現在のユーザーidと一致すれば編集可能
        if (post.userId === req.body.userId) {
            //引数はいらない
            await post.deleteOne();
            return res.status(200).json("投稿削除に成功しました！");
        } else {
            return res.status(403).json("あなたは他の人の投稿を削除できません");
        }
    } catch(err) {
        return res.status(403).json(err);
    } 
});

//特定の投稿取得
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        return res.status(200).json(post);
    } catch (err) {
        return res.status(500).json(err);
    }
});

//特定の投稿にいいねを押す
router.put('/:id/like', async (req, res) => {
     try {
        const post = await Post.findById(req.params.id);
        //自身がまだ投稿にいいねが押されていなかったらいいねを押せる
        if(!post.likes.includes(req.body.userId)) {
            await post.updateOne({
                $push: {
                    likes: req.body.userId,
                },
            });
            return res.status(200).json("投稿にいいねを押しました！")
        } else {
            await post.updateOne({
                $pull: {
                    likes: req.body.userId,
                } 
            });
            return res.status(403).json("投稿にいいねを外しました！");
        }

     } catch(err) {
        return res.status(500).json(err);
     }
    });

    //プロフィール専用のタイムライン取得
    router.get("/profile/:username", async(req, res) => {
    
        try {
            //Idによって探すのではなく名前で探すのでfindOne(プロパティの指定が必要)
            const user = await User.findOne({ username: req.params.username });
            //currentUserで取得したユーザー（自分）の投稿をすべて取得
    
            const posts = await Post.find({ userId: user._id });
            console.log(posts);
            return res.status(200).json(posts);
            
        } catch (err) {
            return res.status(500).json(err);
        }
    });

//タイムラインの投稿を取得（フォローしている人+自分の投稿）
// router.get("/timeline")
// これだと「特定の投稿を取得する」APIと被ってエラーが起こるため、以下のような差別化が必要
router.get("/timeline/:userId", async(req, res) => {
    //「:userId」とすることで任意のユーザーの投稿を取得できるようにする

    try {
        const currentUser = await User.findById(req.params.userId);
        //currentUserで取得したユーザー（自分）の投稿をすべて取得

        const userPosts = await Post.find({userId: currentUser._id});

        //自分がフォローしているユーザーの投稿をすべて取得
        const friendPosts = await Promise.all(
            //currentUserの取得はいつ行われるか分からないため、Promise.allでいつでも処理を行えるように待つ。
            currentUser.following.map((friendId) => {
                return Post.find({ userId: friendId });
            })
        );

        //concatで配列と配列を組み合わせる
        //friendPostsはmapでひとつひとつ取り出されたものを、またひとつひとつ取り出すので、spread
        return res.status(200).json(userPosts.concat(...friendPosts));

    } catch (err) {
        return res.status(500).json(err);
    }
});





module.exports = router;

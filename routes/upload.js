const router = require("express").Router();
const multer = require("multer");

// 保存先、保存する画像の名前を指定
const storage = multer.diskStorage({
    
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    },
});


const upload = multer({ storage });

//画像アップロード用API 第二引数にミドルウェア（single関数）
router.post("/", upload.single("file"), (req, res) => {
    try {

        return res.status(200).json("画像アップロードに成功しました！");

    } catch(err) {
        console.log(err);
    }
});

module.export = router;
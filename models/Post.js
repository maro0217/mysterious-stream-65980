//ユーザー情報に関するデータスキーマ
const mongoose = require("mongoose");


const PostSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        max: 200,
    }, 
    img: {
        type: String,
    },
    likes: {
        //だれがいいねを押したのかを格納
        type: Array,
        default: [],
    },
},

{ timestamps: true }//データを格納した時間を自動で格納
);

// PostSchemaをPostという変数で宣言
// どのファイルでも使えるようにexport
module.exports =  mongoose.model('Post', PostSchema);

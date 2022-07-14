//投稿情報に関するデータスキーマ
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true, //「username」が必ず必要であるという宣言
        min: 5,
        max: 25, //文字数の制限
        unique: true, //他のuserと重複した名前であってはならない
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 50,
    },
    profilePicture: {
        type: String,
        default: "",
    },
    coverPicture: {
        type: String,
        default: "",      
    },
    followers: {
        type: Array,
        default: [],      
    }, 
    following: {
        type: Array,
        default: [], 
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    desc: {
        type: String,
        max: 70,
    },
    city: {
        type: String,
        max: 50,
    },
},

{ timestamps: true }//データを格納した時間を自動で格納
);

// UserSchemaをUserという変数で宣言
// どのファイルでも使えるようにexport
module.exports =  mongoose.model('User', UserSchema);


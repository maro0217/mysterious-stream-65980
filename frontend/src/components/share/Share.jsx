import React, { useContext, useRef } from 'react'
import { Image, Gif, Face, Analytics} from '@mui/icons-material';
import './Share.css'
import { AuthContext } from '../../state/AuthContext';
import axios from 'axios';
import { useState } from 'react';


export default function Share() {
    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;

    const {user} = useContext(AuthContext);
    const desc = useRef();

    //画像を選択したらsetFileに格納される
    const [file, setFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newPost = {
            //  ログインしているユーザーのID
            userId: user._id,
            // useRefでもってきた投稿内容
            desc: desc.current.value,
            
        };

        // fileがある場合APIを叩いていく
        if(file) {
            //フォームで打ち込まれた画像をkeyとバvalueを残してdataにする
            const data = new FormData();

            //ファイルの名前だけだと同じ画像をアップロードした際エラーになってしまう。
            // 投稿した日時を名前に含めることでエラー回避
            const fileName = Date.now() + file.name;
            data.append("name", fileName);
            data.append("file", file);
            newPost.img = fileName;

            try {

                // 第二引数に画像のdata
                await axios.post("/upload", data);
            } catch (err) {
                console.log(err)
            }
        }

        try {
            await axios.post("/posts", newPost);
            // 投稿されたら勝手にリロード
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    };


    return (
        <div className="share">
            <div className="shareWrapper">
                <div className="shareTop">
                    <img 
                        src={
                            user.profilePicture ?
                            PUBLIC_FOLDER + user.profilePicture :
                            PUBLIC_FOLDER + "/person/noAvatar.png"
                        }
                        alt="" 
                        className="shareProfileImg" 
                    />
                    <input
                        type="text"
                        className="shareInput"  
                        placeholder='今何してるの？'
                        ref={desc}
                    />
                </div>
                <hr className="shareHr" />
                        {/* preventDefaultするのにonSubmitが必要 */}
                <form className="shareButtons" onSubmit={(e) => handleSubmit(e)}> 
                    <div className="shareOptions">
                        {/* htmlForとidを一致させて、input機能をlabelに持たせる */}
                        <label className="shareOption" htmlFor='file'>
                            <Image className='shareIcon' htmlColor='blue'/>
                            <span className="shareOptionText">写真</span>
                            <input 
                                type="file" 
                                id='file' 
                                accept=".png, .jpeg, .jpg" 
                                style={{display: "none"}}
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                        </label>
                        <div className="shareOption">
                            <Gif htmlColor='hotpink'/>
                            <span className="shareOptionText">GIF</span>
                        </div>
                        <div className="shareOption">
                            <Face className='shareIcon' htmlColor='green'/>
                            <span className="shareOptionText">気持ち</span>
                        </div>
                        <div className="shareOption">
                            <Analytics className='shareIcon' htmlColor='red'/>
                            <span className="shareOptionText">投稿</span>
                        </div>
                    </div>
                    <button className="shareButton" type='submit'>
                        投稿
                    </button>
                </form>
            </div>
        </div>
    )
}

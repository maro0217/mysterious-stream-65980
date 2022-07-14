import React, { useContext, useEffect, useState } from 'react'
import './Post.css'
import { MoreVert } from '@mui/icons-material'
import axios from 'axios';
import { format } from 'timeago.js';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../state/AuthContext';
// import { Users } from '../../dummyData.js'

export default function Post({ post }) {
    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;

    // ログインしているユーザーの監視
    const {user: currentUser} = useContext(AuthContext)
    // const user = Users.filter((user) => user.id === 1);
    // console.log(user)

    //いいねの数の状態が動的に変更されるようにする
    const [like, setLike] = useState(post.likes.length);

    //自分がいいねを押しているかいないかの状態が動的に変更されるようにする
    const [isLiked, setIsLiked] = useState(false);

    //投稿したuserの監視
    const [user, setUser] = useState({});


    useEffect(() => {
      const fetchUser = async () => {
        // propsで渡された投稿のユーザーのuserIdを取得
        const response = await axios.get(`/users?userId=${post.userId}`);  
        //Posts変数にfetchPostsで叩いてきたデータを代入できる
        setUser(response.data);
  
      };
      fetchUser();
    }, [post.userId]);
    //post.userIdが変更される度に更新をかける
  

    const handleLike = async () => {
        try {
            //いいねのAPIを叩く
            await axios.put(`/posts/${post._id}/like`, {userId: currentUser._id}); //ログインしているユーザーのid

        } catch (err) {
            console.log(err);
        }

        setLike(isLiked ? like - 1 : like + 1);
        setIsLiked(!isLiked)
    }
  return (
    <div className='post'>
        <div className="postWrapper">
            <div className="postTop">
                <div className="postTopLeft">
                    <Link to={`/profile/${user.username}`}>
                        <img
                            src={
                                user.profilePicture ?
                                PUBLIC_FOLDER + user.profilePicture :
                                PUBLIC_FOLDER + "/person/noAvatar.png"
                            }
                            alt=""
                            className="postProfileImg"
                        />
                    </Link>
                    <span className="postUsername">
                        {user.username}
                    </span>
                    <span className="postDate">{format(post.createdAt)}</span>
                </div>
                <div className="postTopRight">
                    <MoreVert />
                </div>
            </div>
            <div className="postCenter">
                <span className="postText">{ post.desc }</span>
                <img src={ PUBLIC_FOLDER + post.img } alt="" className="postImg"/>
            </div>
            <div className="postBottom">
                <div className="postBottomLeft">
                    <img src={PUBLIC_FOLDER + "/heart.png"} alt="" className='likeIcon' onClick={() => handleLike()}/>
                    <span className="postLikeCounter">{ like }人がいいねを押しました</span>
                </div>
                <div className="postBottomRight">
                    <span className="postCommentText">{ post.comment }:コメント</span>
                </div>
            </div>
        </div> 
    </div>
  )
}

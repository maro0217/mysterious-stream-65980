import React, { useEffect, useState } from 'react'
import Rightbar from '../../components/rightbar/Rightbar'
import Sidebar from '../../components/sidebar/Sidebar'
import Timeline from '../../components/timeline/Timeline'
import Topbar from '../../components/topbar/Topbar'
import './Profile.css'
import axios from 'axios'

//パラメータを取ってくることができるHooks
import { useParams } from 'react-router-dom'


export default function Profile() {
    //ルーティングの設定によって画像パス指定が「profile/assets」になっているが実際は「public/assets」
    //.envでpublicフォルダの中のディレクトリを指定
    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;

    const [user, setUser] = useState({});
    const username = useParams().username

    useEffect(() => {
      const fetchUser = async () => {
        const response = await axios.get(`/users?username=${username}`);
        console.log(response.data);
  
        //Posts変数にfetchPostsで叩いてきたデータを代入できる
        setUser(response.data);
  
      };
      fetchUser();
    }, []);

  return (
    <>
        <Topbar />
        <div className="profileContainer">
            <Sidebar />
            <div className="profileRight">
                <div className="profileRightTop">
                    <div className="profileCover">
                        <img
                            src={user.coverPicture || PUBLIC_FOLDER + "/post/3.jpeg"}
                            alt=""
                            className="profileCoverImg"
                        />
                        <img 
                            src={PUBLIC_FOLDER + user.profilePicture  || PUBLIC_FOLDER + "/person/noAvatar.png"}
                            alt=""
                            className="profileUserImg"
                        />
                    </div>
                </div>
                <div className="profileInfo">
                                                     {/* stateのuser */}
                    <h4 className="profileInfoName">{user.username}</h4> 
                    <span className="profileInfoDesc">{user.desc}</span>
                </div>
                <div className="profileRightBottom">
                    {/* useParamsで取得したusername */}
                    <Timeline username={username}/>
                    <Rightbar user={user}/>
                </div>
            </div>
        </div>
    </>
  )
}

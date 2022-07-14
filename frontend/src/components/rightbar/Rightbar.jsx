import React from 'react'
import './Rightbar.css'
import { Users } from '../../dummyData.js'
import Online from '../online/Online'


export default function Rightbar({ user }) {
  const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;

  const HomeRightbar = () => {
    return (
      <>
        <div className="eventcontainer">
          <img src={PUBLIC_FOLDER + "/star.png"} alt="" className='starImg'/>
          <span className="eventText">
            <b>フォロワー限定</b>イベント開催中！
          </span>
          <img src={PUBLIC_FOLDER + "/ad.jpeg"} alt="" className='eventImg'/>
          <h4 className="rightbarTitle">オンラインの友達</h4>
          <ul className="rightbarFriendList">
            {Users.map((user) => (
              <Online user={user} key={user.id}/>
            ))}
          
          </ul>
        </div>
        <p className="promotionTitle">プロモーション広告</p>
        <img src={PUBLIC_FOLDER + "/promotion/promotion1.jpeg"} alt="" className="rightbarPromotionImg" />
        <p className="promotionName">ショッピング</p>
        <img src={PUBLIC_FOLDER + "/promotion/promotion2.jpeg"} alt="" className="rightbarPromotionImg" />
        <p className="promotionName">カーショップ</p>
        <img src={PUBLIC_FOLDER + "/promotion/promotion3.jpeg"} alt="" className="rightbarPromotionImg" />
        <p className="promotionName">株式会社まろ</p>
      </>
    )
  }

  const ProfileRightbar = () => {
    return (
      <>
        <h4 className="rightbarTitle">ユーザー情報</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">出身：</span>
            <span className="rightbarInfokey">福岡</span>
          </div>
          <h4 className="rightbarTitle">あなたの友達</h4>
          <div className="rightbarFollowings">
            <div className="rightbarFollowing">
              <img src={PUBLIC_FOLDER + "/person/1.jpeg"} alt="" className="rightbarFollowingImg" />
              <span className="rightbarFollowingName">ありゃ</span>
            </div>
            <div className="rightbarFollowing">
              <img src={PUBLIC_FOLDER + "/person/2.jpeg"} alt="" className="rightbarFollowingImg" />
              <span className="rightbarFollowingName">これは</span>
            </div>
            <div className="rightbarFollowing">
              <img src={PUBLIC_FOLDER + "/person/3.jpeg"} alt="" className="rightbarFollowingImg" />
              <span className="rightbarFollowingName">どうにか</span>
            </div>
            <div className="rightbarFollowing">
              <img src={PUBLIC_FOLDER + "/person/4.jpeg"} alt="" className="rightbarFollowingImg" />
              <span className="rightbarFollowingName">しそうだ</span>
            </div>
            <div className="rightbarFollowing">
              <img src={PUBLIC_FOLDER + "/person/5.jpeg"} alt="" className="rightbarFollowingImg" />
              <span className="rightbarFollowingName">ぽぽぽぽーん</span>
            </div>
          </div>
        </div>
      </>
    )
  }

  //共通項は最後のreturnに残し、<Rightbar profile/> とコンポーネントにprofile属性がついているかいないかで、
  //表示するhtmlを分ける
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}

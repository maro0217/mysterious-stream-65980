import React, { useContext, useEffect, useState } from 'react'
import Post from '../posts/Post'
import Share from '../share/Share'
import axios from 'axios';
// import { Posts } from '../../dummyData.js'

import './Timeline.css'
import { AuthContext } from '../../state/AuthContext';

export default function Timeline({ username }) {
  const {user} = useContext(AuthContext);

  //fetchしてくる投稿データの格納
  const [posts, setPosts] = useState([]);

  //タイムラインの取得は、ページを読み込んだ1回だけでよい。その1回をuseEffectで誘発
  //第二引数を空にしておくことで、第一引数に書かれている処理が一度だけレンダリング実行される
  useEffect(() => {

    //エンドポイントを指定
    //特定のユーザーの投稿を指定
    //node側でGETメソッドを非同期処理しているため、まだデータを取ってこれず、フロント側が先にデータを取ってきている状態になっている
    //こちらも非同期処理にするべき。useEffectに直接asyncは書けないので、中に匿名関数を作る
    const fetchPosts = async () => {
      const response = username
         ? await axios.get(`/posts/profile/${username}`) //プロフィールの場合(propsとしてのusername)
         : await axios.get(`/posts/timeline/${user._id}`) //ホームの場合(contextとしてのuser)
      console.log(response.data);

      //Posts変数にfetchPostsで叩いてきたデータを代入できる
      //昇順のアルゴリズム
      setPosts(response.data.sort((post1, post2) => {

        // これがtrue（正の値）だとpost2が先に表示される
          return new Date(post2.createdAt) - new Date(post1.createdAt);
        })
      );

    }
    fetchPosts();
  }, [username, user._id]);


  return (
    <div className='timeline'>
      <div className="timelineWrapper">
        <Share />
        {posts.map((post) => (
          <Post post={post} key={post._id}/>
        ))}
      </div>
    </div>
  )
}

import React, { useContext, useRef } from 'react'
import { loginCall } from '../../actionCalls';
import { AuthContext } from '../../state/AuthContext';
import './Login.css'
export default function Login() {
  const email = useRef();
  const password = useRef();
  //グローバルコンテキストとして指定された変数をuseContextで使える
  const {user, isFetching, error, dispatch} = useContext(AuthContext)
  console.log(email);

  //ログインボタンを押した時に発生するイベント
  const handleSubmit = (e) => {
    //ログインボタンを押してもリロードされない
    e.preventDefault();

    //入力された値を取得
    console.log(email.current.value);
    console.log(password.current.value);
    loginCall(
      {
        email: email.current.value,
        password: password.current.value
      },
      dispatch
    )
  };
  console.log(user);


  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className='loginLogo'>Real SNS</h3>
          <span className="loginDesc">本格的なSNSを、自分の手で。</span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={(e) => handleSubmit(e)}>
            <p className="loginMsg">ログインはこちら</p>
            <input
               type="email" 
               className="loginInput" 
               placeholder='email' 
               required
               ref={email}
            />
            {/* ↑refで値を監視・参照できる */}
            <input 
              type="password" 
              className="loginInput" 
              placeholder='password' 
              minLength="6"
              ref={password}
            />
            <button className="loginButton">ログイン</button>
            <span className="loginForgot">パスワードを忘れた方へ</span>
            <button className="loginRegisterButton">アカウント作成</button>
          </form>
        </div>
      </div>
    </div>
  )
}

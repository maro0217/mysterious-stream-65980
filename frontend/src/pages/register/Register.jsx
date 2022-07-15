import axios from 'axios';
import React from 'react'
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css'

export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordConfirmation = useRef();

  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(username.current.value);
    

    //パスワードと確認用のパスワードが合っているかどうかを確認
    if(password.current.value !== passwordConfirmation.current.value) {
      console.log(password.current.value);
      console.log(passwordConfirmation.current.value);

      //htmlの組み込み関数。合っているかどうかを自動的に検出→ログを出す
      passwordConfirmation.current.setCustomValidity("パスワードが違います")
    } else {
      try {
        const user = {
          username: username.current.value,
          email: email.current.value,
          password: password.current.value,
        };
        console.log(user);

        //registerのapiを叩く。第二引数で登録するユーザーを指定
        await axios.post("/auth/register", user);

        //ログインページにリダイレクト
        navigate("/login")
      } catch (err) {
        console.log(err)
      }
    }
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className='loginLogo'>Real SNS</h3>
          <span className="loginDesc">本格的なSNSを、自分の手で。</span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={(e) => handleSubmit(e)}>
            <p className="loginMsg">新規登録はこちら</p>
            <input type="text" className="loginInput" placeholder='ユーザー名' required ref={username}/>
            <input type="email" className="loginInput" placeholder='Eメール' required ref={email}/>
            <input type="password" className="loginInput" placeholder='パスワード' minLength="6" required ref={password}/>
            <input type="password" className="loginInput" placeholder='確認用パスワード' minLength="6" required ref={passwordConfirmation}/>
            <button className="loginButton" type='submit'>サインアップ</button>
            <button className="loginRegisterButton">ログイン</button>
          </form>
        </div>
      </div>
    </div>
  )
}

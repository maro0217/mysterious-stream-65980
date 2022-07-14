// dispatchを設定

import axios from "axios";

export const loginCall = async(user, dispatch) => {
    //ログインが始まったことをstoreに通知
    //ユーザーの状態の監視をどのコンポーネントでも可能にするためのdispatch
    dispatch({type: "LOGIN_START"});

    try {
//ログインスタートが正常に行われた場合、ログインのAPIを叩く
        const response = await axios.post("auth/login", user);
        dispatch({ type: "LOGIN_SUCCESS", payload: response.data });

    } catch(err) {
        dispatch({ type: "LOGIN_ERROR", payload: err });
    }
}
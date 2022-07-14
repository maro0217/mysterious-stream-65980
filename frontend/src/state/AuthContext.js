//グローバルコンテキストを作り出せる(createContex)
import { createContext, useEffect, useReducer } from 'react';

// 新しいstateの状態に更新する
import AuthReducer from './AuthReducer.js';

//最初のユーザー状態を定義
const initialState = {
    //localStorageにユーザーが保存されていればparseで解析、なければnull
    //user状態がリロードされても維持
    user: JSON.parse(localStorage.getItem("user")) || null,

    // ハードコーディング
    // user: {
    //     _id: "62c6532aab6da762473622aa",
    //     username: "Marochan",
    //     email: "ydaye07@gmail.com",
    //     password: "abcdef",
    //     profilePicture: "/person/1.jpeg",
    //     coverPicture: "",
    //     followers: [],
    //     following: [],
    //     isAdmin: false,
    // },
    isFetching: false,
    error: false,
}

//状態をグローバルに管理する
//初期値のユーザー状態をどこでも使えるものとして作れる（useContextで使用）
export const AuthContext = createContext(initialState);

//認証状態をどこにでも提供する
export const AuthContextProvider = ({ children }) => {

    //Reducer関数と初期値を渡して、ログイン状態をstateで監視。アクション名を指定してdispatch発火
    const [state, dispatch] = useReducer(AuthReducer, initialState);

    // 第二引数に上のユーザー状態が変わったら、useEffectの中身が発火する
    useEffect(() => {
        //ローカルストレージに「user」という名前でセットできる
        localStorage.setItem("user", JSON.stringify(state.user));
    } , [state.user]);


    //createContextを使っている時にProviderを指定でき、どこにでも提供できる情報をvalueで指定できる
    return (
        <AuthContext.Provider
            value={{
                user: state.user,
                isFetching: state.isFetching,
                error: state.error,
                dispatch,
            }}
        >
{/* AuthContext.Providerの子要素は渡されたvalue全てを使える。今回でいうappコンポーネント */}
            {children}

        </AuthContext.Provider>
    )
};



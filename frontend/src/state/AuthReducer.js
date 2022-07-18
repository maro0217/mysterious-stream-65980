// action: authactionsで設定したaction
const AuthReducer = (state, action) => {
    // actionのtypeに応じてどのstate状態に更新するのか
    switch(action.type) {
        case "LOGIN_START":
            return {
                user: null,
                isFecthing: true,
                error: false,
            };
            
        case "LOGIN_SUCCESS":
            return {
                // ログインしたユーザーの新しい状態
                user: action.payload,
                isFecthing: false,
                error: false,
            };

        case "LOGIN_FAILED":
            return {
                user: null,
                isFecthing: false,
                error: action.payload,
            };

        default:
            return state;
    }
};

export default AuthReducer;

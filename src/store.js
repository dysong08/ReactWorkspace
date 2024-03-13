// state 보관소
import { configureStore, createSlice } from "@reduxjs/toolkit";
import { getCookie, removeCookie } from "./utils/Cookie";

let init = () => {
    let user = getCookie('user');
    return user ? user : null;
};

let user = createSlice({
    name: 'user', //state 이름
    initialState: init(),
    reducers: { // state값을 변경해주는 함수들을 정의하는 부분.
        // 모든 reducers함수들의 첫번째 매개변수는 현재 state값이 깊은복사된 형태로 전달된다.

        프로필랜덤변경(state) {
            let random = Math.floor(Math.random() * 5); // 0-5 랜덤값
            state.profile = `/images/user${random}.jpg`;
            return state;
        },
        로그아웃(state) {
            removeCookie('user');
            removeCookie('accessToken');
            return null;

        },
        로그인(state, 데이터) {
            // console.log(데이터.payload);
            // return 데이터.payload; // payload : 

        }
    },
});


export default configureStore({
    reducer: {
        user: user.reducer,  // 변수명.reducer
    }
})

export let { 프로필랜덤변경, 로그아웃, 로그인 } = user.actions;
// reducers 내부에 작성한 코드들은 actions라는 객체 안에 담겨 있음
import { createSlice } from "@reduxjs/toolkit";

// let user = createSlice({
//     name: 'user', //state 이름
//     initialState: {
//         userNo: 1,
//         email: 'abc@naver.com',
//         nickName: "abc",
//         profile: '/images/user0.jpg'
//     }, // state 초기값설정 ==> let [user, ?] = useState({email : .., nickname : ..})
//     reducers: { // state값을 변경해주는 함수들을 정의하는 부분.
//         // 모든 reducers함수들의 첫번째 매개변수는 현재 state값이 깊은복사된 형태로 전달된다.

//         프로필랜덤변경(state) {
//             let random = Math.floor(Math.random() * 5); // 0-5 랜덤값
//             state.profile = `/images/user${random}.jpg`;
//             return state;
//         },
//         로그아웃(state) {
//             return null;
//         },
//         로그인(state, 데이터) {
//             console.log(데이터.payload);
//             return 데이터.payload; // payload :
//         }
//     },
// });

// export default user;


let user = createSlice({
    name: 'user', //state 이름
    initialState: null, // state 초기값설정 ==> let [user, ?] = useState({email : .., nickname : ..})
    reducers: { // state값을 변경해주는 함수들을 정의하는 부분.
        // 모든 reducers함수들의 첫번째 매개변수는 현재 state값이 깊은복사된 형태로 전달된다.

        // 프로필랜덤변경(state) {
        //     let random = Math.floor(Math.random() * 5); // 0-5 랜덤값
        //     state.profile = `/images/user${random}.jpg`;
        //     return state;
        // },
        // 로그아웃(state) {
        //     return null;
        // },
        // 로그인(state, 데이터) {
        //     console.log(데이터.payload);
        //     return 데이터.payload; // payload : 
        // }
    },
});

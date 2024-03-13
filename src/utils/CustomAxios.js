import axios from "axios";
import { getCookie } from "./Cookie";


// axios모듈 재정의. axios 전송시 항상 header에 jst토큰정보를 추가시킴

const CustomAxios = axios.create();

CustomAxios.interceptors.request.use(function (request) {
    request.headers.Authorization = getCookie('accessToken');
    return request;
});


// 유효한 토큰이 아닐경우, 재로그인하도록 페이지 리다이렉트
CustomAxios.interceptors.response.use(function (response) {
    return response; // 문제없는 경우 정상실행
},
    async function (error) { // 에러 발생시 실행할 함수
        // 응답상태 : 403(권한없음)
        const { response: { status } } = error;

        if (status === 403) {
            // 403 뜨는 경우
            // 1. url에 대한 사용권한이 없는 경우
            // 2. 로그인을 하지 않은 경우
            // 3. JWT가 만료된 경우
            window.location.href = '/auth/login';
        }
    }
);


export default CustomAxios;
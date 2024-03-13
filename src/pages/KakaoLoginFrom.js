import axios from 'axios';
import KakaoLogin from 'react-kakao-login';
import { setCookie } from '../utils/Cookie';
import { useDispatch } from 'react-redux';
import { 로그인, 로그아웃 } from '../store';
import { useNavigate } from 'react-router-dom';

const KakaologinFrom = () => {

    // js API KEY
    const kakaoClientId = "69dde702fd764b987d1ed69a7f807aa6";
    const dispatch = useDispatch();
    const navi = useNavigate();

    const kakaoOnSuccess = async (data) => {
        console.log("카카오에서 전달받은 토큰", data);
        // 1. 소셜로그인시 최초로그인이라면 회원정보를 DB에 저장
        // 2. 토큰의 인가코드(access_token) 를 서버로 전달

        await axios
            .post("http://localhost:8084/api/auth/login/kakao", { idToken: data.response.access_token })
            .then((res) => {
                // res => 반환받은 jwt토큰이 보관되어있을 예정
                console.log("서버에서 내려준 토큰", res);

                // 전달받은 토큰을 쿠키에 저장하기
                setCookie("accessToken", res.data.jwtToken);
                setCookie("user", JSON.stringify(res.data.user));
                dispatch(로그인(res.data.user));
                navi('/');



            }).catch(console.log("에러발생"))

    };

    const kakaoOnFail = (error) => {
        console.log("에러발생", error);
    };



    return (

        <KakaoLogin token={kakaoClientId}
            onSuccess={kakaoOnSuccess}
            onFail={kakaoOnFail}
        />
    )
}

export default KakaologinFrom;
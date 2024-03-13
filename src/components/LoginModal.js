import { useState } from "react";
import { useDispatch } from "react-redux";
import { 로그인 } from "../store";

export default function LoginModal({ 모달창닫기 }) {

    let [유저정보, 유저정보변경함수] = useState({
        userNo: 1,
        email: '',
        nickname: '',
        profile: '/images/user3.jpg'
    });

    let 유저정보변경핸들러 = (e) => {
        유저정보변경함수({ ...유저정보, [e.target.name]: e.target.value });
    }

    const 전송 = useDispatch();

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={모달창닫기}>&times;</span>
                <div className="login-form">
                    <label>
                        유저번호:
                        <input type="text" name="userNo"
                            onChange={유저정보변경핸들러}
                            value={유저정보.userNo} />
                    </label>
                    <label>
                        이메일:
                        <input type="text" name="email"
                            onChange={유저정보변경핸들러}
                            value={유저정보.email} />
                    </label>
                    <label>
                        닉네임:
                        <input type="text" name="nickname"
                            onChange={유저정보변경핸들러}
                            value={유저정보.nickname} />
                    </label>
                    <button onClick={() => {
                        전송(로그인(유저정보));  // 로그인정보 store에 전달
                        모달창닫기();  // 전달 후 모달창 닫기
                    }}>로그인</button>
                </div>
            </div>
        </div>
    )
}
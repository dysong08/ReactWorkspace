import { useEffect } from "react";
import { useState } from "react"
import axios from "../utils/CustomAxios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../utils/Cookie";

export default function ChattingRoomList() {

    let [채팅방목록, 채팅방목록변경] = useState([]);
    let [모달, 모달창오픈] = useState(false);

    let navi = useNavigate();

    useEffect(() => {
        // axios.get("http://localhost:3000/api/chatRoomList")
        axios.get("http://localhost:8084/api/chatRoomList",
            {
                // 카카오 로그인때문에 포트번호 8084변경,,  headers 추가
                headers: {
                    "Authorization": getCookie('accessToken')
                }
            })
            .then((Response) => {
                채팅방목록변경(Response.data); // 채팅방 목록페이지 조회
            }
            ).catch((err) => console.log(err))

    }, [])

    function 채팅방참여(채팅방번호) {
        navi('/chat/detail/' + 채팅방번호);
    }


    return (
        <>
            <section className="board-list">
                <h1 className="board-name">채팅방 목록</h1>
                <div className="list-wrapper">
                    <table className="list-table">
                        <thead>
                            <tr>
                                <th>방번호</th>
                                <th>채팅방 주제(제목)</th>
                                <th>개설자</th>
                                <th>참여인원수</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                채팅방목록.length == 0 ?
                                    (
                                        <tr>
                                            <td colSpan={4}>존재하는 채팅방이 없습니다.</td>
                                        </tr>
                                    ) : (
                                        채팅방목록.map((채팅방) => {
                                            return (
                                                <tr key={채팅방.chatRoomNo}>
                                                    <td>{채팅방.chatRoomNo}</td>
                                                    <td>
                                                        {채팅방.title}
                                                        <button onClick={() => 채팅방참여(채팅방.chatRoomNo)}>참여</button>
                                                    </td>
                                                    <td>{채팅방.nickName}</td>
                                                    <td>{채팅방.cnt}</td>
                                                </tr>

                                            )
                                        })
                                    )
                            }

                        </tbody>
                    </table>

                    <div className="btn-area">
                        <button onClick={() => 모달창오픈(true)}>채팅방만들기</button>
                    </div>
                </div>
            </section>


            {모달 && <채팅창 모달창오픈={모달창오픈} />}

        </>
    )
}

function 채팅창({ 모달창오픈 }) {

    let [title, setTitle] = useState('');
    let user = useSelector((state) => state.user);
    const navi = useNavigate();


    const openChatRoom = () => {
        const chatRoom = {
            title,
            userNo: user.userNo
        }

        axios.post("http://localhost:3000/api/openChatRoom", chatRoom)
            .then((result) => {
                if (!title) return;
                // result값으로 추가된 방번호(chatRoomNo)를 얻어와서
                // 해당방번호를 가지고 페이지 이동시켜줄 예정
                // navi("/chat/chattingRoom/"+result.ata)
                console.log(result);
                모달창오픈(false);
                alert("채팅방 생성 성공");
                navi(0);
            })
            .catch(error => console.log(error))
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={() => 모달창오픈(false)} >&times;</span>
                <div className="login-form">
                    <h3>채팅방 만들기</h3>
                    <input type="text" name="title" className="form-control" placeholder="채팅방 제목"
                        value={title} onChange={(e) => { setTitle(e.target.value) }} />
                    <button onClick={(e) => openChatRoom()}>만들기</button>
                </div>
            </div>
        </div>
    )
}


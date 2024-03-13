import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios";
import { useState } from "react";
import Messages from "../components/Messages";
import SockJs from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { useSelector } from 'react-redux'
import { useRef } from "react";
import ChatRoomMembers from "../components/ChatRoomMembers";


export default function ChattingRoom() {

    const { chatRoomNo } = useParams();
    let [chatMessages, setChatMessages] = useState([]);
    const [webSocket, setWebSocket] = useState(null);
    let [message, setMessage] = useState('');
    let [chatRoomMembers, setChatRoomMembers] = useState([]);

    const bottonRef = useRef(null); // 채팅창 맨 마지막 글로 스크롤 내릴때 사용
    const textareaRef = useRef(null); // 채팅글 입력 후 개행 비워줄 예정

    const navi = useNavigate();

    let user = useSelector((state) => state.user);
    useEffect(() => {

        // 웹소켓 연결할 수 있는 함수
        // const createWebsocket = () => new SockJs("http://localhost:3000/api/stompServer");
        const createWebsocket = () => new SockJs("http://localhost:8084/api/stompServer");

        // 웹소켓 객체 생성은 Stomp가 주관할 예정
        const stompClient = Stomp.over(createWebsocket);

        stompClient.connect({}, (frame) => {
            console.log(frame);
            // stomp의 경우 웹서버와 통신할때 frame단위로 동작을 함.
            // frame을 메세지를 교환하는 틀이라고 생각할 것

            // 구독 url 설정
            // 내가 구독한 url로 데이터가 전달되면 실시간으로 감지하고 콜백함수를 실행한다.
            stompClient.subscribe(`/chat/chatRoomNo/${chatRoomNo}/message`, async (frame) => {
                console.log(frame.body); // 직접 json 파싱해줘야 함
                let jsonMessage = frame.body;
                let parsedMessage = await JSON.parse(jsonMessage);
                // JSON파싱이 비동기이기 때문에 await를 앞에 붙여 완료되기를 기다린 후 다음코드 실행시킴

                // 의존성배열이 비어있는 useEffect내부에서 atate값은 항상 "초기랜더링시의 값"만을 가지고 있음.
                // setChatMessages([...chatMessages, parsedMessage])
                setChatMessages((preState) => [...preState, parsedMessage])

                // async 예약어
                // await 비동기함수 앞에 작성(비동기를 기다린 후 실행함)
            });

            // 채팅방에 누가 입장했을때 
            stompClient.subscribe(`/chat/chatRoomNo/${chatRoomNo}/newMember`, async (frame) => {
                let jsonMember = frame.body;
                let user = await JSON.parse(jsonMember);

                setChatRoomMembers((preState) => {
                    let fillerList = preState.filter(u => u.userNo !== user.userNo);
                    return [...fillerList, user];
                })
            })
            // 채팅방에서 누가 퇴장시
            stompClient.subscribe(`/chat/chatRoomNo/${chatRoomNo}/exitMember`, async (frame) => {
                let user = await JSON.parse(frame.body);
                setChatRoomMembers((state) => {
                    return state.filter((chatUser) => chatUser.userNo !== user);
                })
            })

            // 채팅방에서 접속중인 사용자의 상태값(온라인 오프라인)이 바뀔때
            stompClient.subscribe(`/chat/chatRoomNo/${chatRoomNo}/userStatus`, async (frame) => {
                let user = await JSON.parse(frame.body);
                setChatRoomMembers((state) => {
                    let filterUser = state.filter((chatUser) => chatUser.userNo != user.userNo);
                    return [...filterUser, user];
                })
            });

            let chatRoomJoin = {
                userNo: user.userNo,
                chatRoomNo,
                userStatus: "1"
            }


            // 1) CHAT_ROOM_JOIN테이블에 참여자 정보추가
            axios.post("/api/joinChatRoom", chatRoomJoin)
                .then((res) => {
                    console.log("참여완료");
                    // 3) 채팅방 참여자 정보조회
                    axios.get("/api/chatRoomJoin/chatRoomNo/" + chatRoomNo)
                        .then((list) => {
                            setChatRoomMembers(list.data);
                        })
                    // 현재 채팅방을 구독중인 사용자들에게 뉴비가 왔음을 알리는 코드
                    stompClient.send("/chat/chatRoom/chatRoomNo/" + chatRoomNo + "/member/" + user.userNo + "/newMember", {}, JSON.stringify(res.data));
                })


            // 2) 채팅방 메세지 목록 가져오기
            axios.get("/api/chatMessage/chatRoomNo/" + chatRoomNo)
                .then((list) => {
                    setChatMessages(list.data);

                }).catch(err => console.log(err))

            setTimeout(() => {
                scrollToBotton()
            }, 100)

            stompClient.send("/chat/chatRoomJoin/" + chatRoomNo + "/member/" + user.userNo + "/updateStatus", {}, JSON.stringify(chatRoomJoin));

        });
        setWebSocket(stompClient);




        return () => {
            // 컴포넌트 소멸시 스톰프 클라이언트 연결해제
            let chatRoomJoin = {
                userNo: user.userNo,
                chatRoomNo,
                userStatus: "2"
            }
            stompClient.send("/chat/chatRoomJoin/" + chatRoomNo + "/member/" + user.userNo + "/updateStatus", {}, JSON.stringify(chatRoomJoin));
            stompClient.disconnect();
        }

    }, [])

    const sendMessage = () => {
        const chatMessage = {
            message,
            chatRoomNo,
            userNo: user.userNo
        }
        if (!message) {
            alert("입력하세요");
            return;
        }
        if (!user) {
            alert("로그인 후 가능합니다.");
            return;
        }
        if (!webSocket) {
            alert("웹소켓 연결중입니다.....");
            return;
        }
        // 웹소켓 서버로 데이터 전송하기
        webSocket.send("/chat/sendMessage/chatRoomNo/" + chatRoomNo, {}, JSON.stringify(chatMessage));
        setMessage("");
    }

    const scrollToBotton = () => {
        if (bottonRef.current) {
            bottonRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }

    const submitMessage = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();

            // setTimeout : 비동기함수와 동일하게 작동시키기 위해 지연시간을 추가함
            // setTimeout(() => {
            //     textareaRef.current.value = "";
            // }, 100)
            setTimeout(() => {
                // textareaRef.current.value = "";
                scrollToBotton();
            }, 100)
        }
    }

    const exitChatRoom = () => {
        // 채팅방 나가기 -> DB에서 CHAT_ROOM_JOIN테이블에서 채팅방번호와 userNo에 해당하는 데이터 삭제
        // 웹소켓의 다른 사용자에게 내가 나갔음을 알리고 채팅목록페이지로 이동

        // axios.get("/api/chat/chatRoomNo/" + chatRoomNo + "/exitChatRoom/" + user.userNo)
        //     .then((exitMember) => {

        //         setChatRoomMembers((preState) => {

        //             let exitMem = preState.splice((member) => member.userNo == user.userNo);
        //             console.log(exitMem);
        //             return [exitMem];
        //         })
        //         navi("/chat/list");
        //         // stompClient.send("/chat/chatRoomNo/" + chatRoomNo + "/member/" + user.user + "/exitMember", {}, JSON.stringify(exitMember.data));
        //     })


        webSocket.send(`/chat/chatRoomNo/${chatRoomNo}/${user.userNo}/exitChatRoom`, {}, {})
        setTimeout(() => {
            navi("/chat/list");
        }, 100);
    }
    console.log(chatRoomMembers);





    return (
        <>
            {/* 채팅방 참여자 목록을 보여주는 부분 */}
            <ChatRoomMembers chatRoomMembers={chatRoomMembers} />

            <div className="chatting-area">
                <div className="chat-header">
                    <button className="btn btn-outline-danger"
                        onClick={exitChatRoom}>나가기</button>
                </div>
                <ul className="display-chatting">
                    <Messages chatMessages={chatMessages} />
                    <li ref={bottonRef}></li>
                </ul>
                <div className="input-area">
                    <textarea rows="3" name='message'
                        ref={textareaRef}
                        onKeyDown={submitMessage}
                        onChange={(e) => { setMessage(e.target.value) }}
                        value={message}></textarea>
                    <button onClick={sendMessage}>전송</button>
                </div>
            </div>
        </>
    )
}
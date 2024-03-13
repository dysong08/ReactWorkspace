import { useSelector } from "react-redux"
import MyChat from "./MyChat";
import OtherChat from "./OtherChat";

export default function Messages({ chatMessages }) {

    let user = useSelector((state) => state.user);
    // state에서 관리중인 user정보 가져오기

    return (
        chatMessages.map((chatMessage) => {
            return (

                chatMessage.userNo == user.userNo ?
                    <MyChat chatMessage={chatMessage} /> : <OtherChat chatMessages={chatMessage} />
            )
        })
    )

}
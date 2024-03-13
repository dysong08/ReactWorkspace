

export default function ChatRoomMembers({ chatRoomMembers }) {


    {/* 채팅방 참여자 목록을 보여주는 부분 */ }
    return (

        <div className="chat-room-members" >
            <h4>참여자 목록</h4>
            <ul className="chat-room-members-ul">
                {
                    chatRoomMembers.map(chatMember => {
                        return (
                            <li>
                                <span className={"user-status " + (chatMember.userStatus == 1 ? 'online' : 'offline')}></span>
                                {chatMember.nickName}
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )

}
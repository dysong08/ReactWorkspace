export default function OtherChat({ chatMessages }) {


    return (
        <li>
            <div>
                <img src="{chatMessage.profile}" style={{ width: '30px', borderRadius: '50px' }} />
                <b>{chatMessages.nickName}</b>
            </div>
            <p className="chat">{chatMessages.message}</p>
            <span className="chatDate" >{chatMessages.createDate}</span>
        </li>
    )
}
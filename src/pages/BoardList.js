import { useNavigate } from "react-router-dom";

export default function BoardList(props) {  //(props)==({모든데이터})

    let { 게시글배열, 게시글배열변경함수,  /* 레이아웃변경*/ 상세보기변경함수 } = props.모든데이터; //props.모든데이터==모든데이터

    const navigate = useNavigate();

    function 게시글삭제(삭제할글번호) {
        let 필터링배열 = 게시글배열.filter(function (게시글) {
            return 게시글.글번호 !== 삭제할글번호;
        });
        게시글배열변경함수(필터링배열);
    }
    /* 
        REST(Peprenstational State Transfer) 
        : URL과 전송방법(Method)을 활용하여
        작업내용(CRUD)을 URL창에 표현하고 필요한 상태(data)를 전달하는 모든 행위를 의미한다.

        /board/detail -> /board/detail/bno(get)
        => board테이블에서 bno에 대한 내용을 참조함
    */

    return (
        <>
            <h2>일반게시판</h2>
            <table className='list-table'>
                <thead>
                    <tr>
                        <th style={{ width: "10%" }}>번호</th>
                        <th style={{ width: "40%" }}>제목</th>
                        <th style={{ width: "20%" }}>작성자</th>
                        <th style={{ width: "20%" }}>작성일</th>
                        <th style={{ width: "10%" }}>삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        게시글배열.map(function (게시글, 인덱스) {
                            return (
                                <tr key={인덱스} onClick={() => {
                                    // 레이아웃변경(2);
                                    // navigate('/board/detail');
                                    navigate('/board/detail/' + 게시글.글번호);
                                    // 게시글.글번호 로 bno값을 넘겨줄 예정
                                    // 상세보기변경함수(게시글);
                                }}>
                                    <td>{게시글.글번호}</td>
                                    <td>{게시글.글제목}</td>
                                    <td>{게시글.작성자}</td>
                                    <td>{게시글.작성일}</td>
                                    <td><button onClick={(e) => {
                                        e.stopPropagation();
                                        // 이벤트가 상위요소에 전파되는 것을 막는 함수
                                        게시글삭제(게시글.글번호)
                                    }}>삭제</button></td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </>
    )
}
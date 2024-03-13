import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Context } from "../App";

export default function BoardDetail({ 모든데이터 }) {
    // url창에 글번호 뽑아오는 법
    // ex) http://localhost:3001/board/detail/2 => 2 추출
    const { bno } = useParams(); // /:파라미터명  => BoardList에서 게시글.글번호 로 보낸값

    let 테스트 = useContext(Context);
    console.log(테스트);


    // let { 상세보기 /*, 레이아웃변경*/ } = 모든데이터;
    let 상세보기 = 모든데이터.게시글배열.find(function (게시글) {
        return 게시글.글번호 == bno;
    })
    // bno를 활용해서 게시글배열에서 bno와 일치하는 게시글 찾아서 넣어주기


    // useEffect 테스트
    let [count, setCount] = useState(0);
    useEffect(function () {
        console.log("첫로딩 update이후 실행", count);
        let time = setTimeout(function () {
            console.log(count);
            // setCount(count + 1);
        }, 2000); //2초가 지나면 콜백함수 실행
        // return문이 없다면 아래 tr태그의 onClick시 고장난다..
        return function () {
            clearTimeout(time);
            // return문 작성시 클릭시에만 count+1되며 다시 정상적으로 돌아온다(2초마다 실행됨)
        }
    })


    const navigate = useNavigate();

    return (
        <> {/* React.Fragment */}
            <h2>게시판상세보기</h2>
            <table className='detail-table'>
                <tr onClick={() => setCount(count + 1)}>
                    <th colSpan={4}>{상세보기.글제목}</th>
                </tr>
                <tr>
                    <th>작성자</th>
                    <td>{상세보기.작성자}</td>
                    <th>작성일</th>
                    <td>{상세보기.작성일}</td>
                </tr>
                <tr>
                    <th>글내용</th>
                    <td colSpan={3} style={{ height: "200px" }}>{상세보기.글내용}</td>
                </tr>
            </table>
            <div className='btn-area'>
                {/* {<button onClick={() => 레이아웃변경(3)} >수정</button>} */}
                <Link to={'/board/update/' + 상세보기.글번호} >수정</Link>
            </div>
        </>
    )
}


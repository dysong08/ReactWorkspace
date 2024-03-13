/* eslint-disable */
/* 콘솔창의 불필요한 에러를 표시안함 */
import './App.css';
import { useState } from 'react';
import data from './data';



function App() {

    let 제목 = "ABC A CLASS";

    // state문법
    let [제목2, 제목변경함수] = useState("ABC A CLASS");

    function 제목2변경() {

        제목변경함수("ABC C CLASS");
    }

    let [게시글배열, 게시글배열변경함수] = useState(data);


    function 게시글삭제(삭제할글번호) {
        let 필터링배열 = 게시글배열.filter((게시글) => 게시글.글번호 !== 삭제할글번호);
        console.log(필터링배열);
        게시글배열변경함수(필터링배열);
    }


    let [글제목, 글제목변경함수] = useState('');  // == let 글제목 = '';
    let [글내용, 글내용변경함수] = useState('');  // 초기값으로 빈문자열 '' 선언함
    let [작성자, 작성자변경함수] = useState('');

    function 게시글등록() {


        if (!글내용 || !글제목 || !작성자) {  // 이와같이 제한함
            alert("전부 입력하세요");
            return;
        }

        // 2. 가져온 데이터를 바탕으로 게시글 객체 생성
        let 게시글 = {
            // 글번호는 게시글배열에서 고유해야 한다. 게시글배열에서 가장 큰 글번호값을 찾은 후 +1 해서 반환해줌
            글번호: Math.max(...게시글배열.map(function (게시글, 인덱스) {
                return 게시글.글번호
            })) + 1,
            글제목,  // == 글제목: 글제목
            글내용,  // == key, value값에 들어가는 변수명이 동일한 경우 속성명 단축구문을 제공함
            작성자,
            작성일: new Date().toLocaleDateString() // == 2024. 01. 15
        }
        // 3. 생성한 게시글객체를 게시글 배열에 추가한 후 게시글배열변경함수 호출(랜더링)
        게시글배열.push(게시글);

        //게시글배열변경함수(게시글배열);   // 주소값 비교로 랜더링 안됨!
        게시글배열변경함수([...게시글배열]);

        // 입력값 초기화(state초기화)
        글제목변경함수('');
        글내용변경함수('');
        작성자변경함수('');
        // input과 textarea에 입력한 값은 남아있지만 등록버튼 클릭시 값이 비워진 것으로 간주됨
    }





    return (
        <div className="App">

            <div className='header'>
                <h3 style={{ fontWeight: "bolder" }}>{제목2}</h3>
            </div>
            <div className='nav'>
                <button onClick={제목2변경}>제목변경 테스트</button>
                <button>게시판</button>
                <button>등록</button>
            </div>
            <br />
            <div className='outer'>
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
                        {게시글배열.map(function (게시글, 인덱스) {
                            return (
                                <tr key={인덱스}>
                                    <td>{게시글.글번호}</td>
                                    <td>{게시글.글제목}</td>
                                    <td>{게시글.작성자}</td>
                                    <td>2023/01/15</td>
                                    <td><button onClick={() => 게시글삭제(게시글.글번호)}>삭제</button></td>
                                </tr>
                            )
                        })
                        }
                    </tbody>
                </table>
            </div>
            <div className='outer'>
                <br />
                <h2>게시글 등록</h2>
                <table className='enroll-table'>
                    <tr>
                        <th>글제목</th>
                        <td colSpan={3}>
                            <input type="text" name="글제목" />
                        </td>
                    </tr>
                    <tr>
                        <th>작성자</th>
                        <td colSpan={3}>
                            <input type="text" name="작성자" />
                        </td>
                    </tr>
                    <tr>
                        <th>글내용</th>
                        <td colSpan={3} style={{ height: "200px" }}>
                            <textarea name="글내용" ></textarea>
                        </td>
                    </tr>
                    <tr>
                        <th colSpan={4}><button onClick={게시글등록}>등록</button></th>
                    </tr>
                </table>
            </div>
        </div>
    );
}

export default App;

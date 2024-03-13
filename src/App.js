/* eslint-disable */
/* 콘솔창의 불필요한 에러를 표시안함 */

import './App.css';
import { createContext, useEffect, useState } from 'react';
import 초기데이터 from './data';


// ./ : 같은위치의 경로임을 의미, 
// 초기게시글 : default옵션으로 export한 경우 다른 변수명으로 가져와도 됨

// import { a, b, c } from './data';
// default옵션이 아닌 객체는 {}로 변수명 똑같이 가져와야 함
import BoardInsert from './pages/BoardInsert';
import BoardList from './pages/BoardList';
import BoardDetail from './pages/BoardDetail';
import BoardUpdate from './pages/BoardUpdate';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Outer from './components/Outer';
import axios from 'axios';
import { 프로필랜덤변경, 로그아웃 } from './store';
import LoginModal from './components/LoginModal';
import ChattingRoomList from './pages/ChattingRoomList';
import ChattingRoom from './pages/ChattingRoom';
import KakaoLogin from 'react-kakao-login';
import KakaologinFrom from './pages/KakaoLoginFrom';

export let Context = createContext(); // 모든 state저장소


function App() {

  const navi = useNavigate();
  let 제목 = "ABC D CLASS";

  // state문법
  let [제목2, 제목변경함수] = useState("ABC E CLASS");
  // let [title, setTitle] = useState("ABC E CLASS");  // =>일반적인 작성관례

  // useState : 리액트에서 제공하는 함수
  // ["ABC E CLASS", function]

  function 제목2변경() {
    // 제목2 = "ABC C CLASS";
    // console.log(제목2);
    // 단순 대입연산자를 활용하는 경우 state값의 변경점을 reactDom이 알지못함

    제목변경함수("ABC C CLASS");
    //useState의 두번째 매개변수로 전달받은 함수를 통해 변경시 화면이 재랜더링된다.
  }
  /*
    비구조화할당 문법 : 배열이나 객체에 들어가 있는 값을 "쉽게" 변수로 할당하는 문법
    
    기존 사용법 : 
    let arr = [1, 2];
    let a = arr[0];
    let b = arr[1];

    let [a, b] = arr;
    리액트는 위와 같이 선언하여 간편하게 사용할 수 있음.

    위 useState()함수의 반환값은 길이 2짜리 배열[]이며
    배열 비구조화할당 문법을 통해 쉽게 배열에 있는 값을 변수로 할당한 것.
    반환된 배열의 0번 인덱스에 있는 값을 제목2 변수에, 
    1번 인덱스에 있는 값을 제목변경함수에 각각 할당한 것.
  */



  // let [게시글배열, 게시글배열변경함수] = useState(초기데이터);
  let [게시글배열, 게시글배열변경함수] = useState([]);


  // 게시글 삭제하기

  // 방법1
  // 해당 방법도 가능하나 실시간으로 인덱스값이 변경되므로 나중에 문제발생할 수 있음.
  const 게시글삭제1 = (삭제할글번호) => {
    // 배열에서 삭제를 담당하는 메서드 Array.splice(인덱스위치, 삭제할개수)
    for (let i = 0; i < 게시글배열.length; i++) {
      if (게시글배열[i].글번호 == 삭제할글번호) {
        게시글배열.splice(i, 1);
        break;
      }
      // arr.push(게시글배열[i]);
    }
    게시글배열변경함수([...게시글배열]);
    // ...전개연산자(깊은복사)=>배열을 풀어줌 
    //ex) [...a, b, c] => a, b, c // {...key:value, key:value} => key:value, key:value
    // Array.from(게시글배열), 게시글배열.slice()

    // 값이 제거된 배열을 넣어줬음에도 랜더링이 이루어지지 않는다.
    // 값을 비교하여 다르면 랜더링을 하지만 배열[]은 주소값을 가지고 있기 때문에 서로 같으므로 랜더링X
  }


  // 방법2
  // 게시글배열에서 글번호와 일치하지 않는 게시글만 필터링하기(filter함수)
  const 게시글삭제2 = (삭제할글번호) => {

    let 필터링배열 = 게시글배열.filter((게시글) => 게시글.글번호 !== 삭제할글번호)

    console.log(필터링배열);
    게시글배열변경함수(필터링배열);
    // == 게시글배열변경함수(게시글배열.filter((게시글) => 게시글.글번호 !== 삭제할글번호)

  }




  /*
    UI 상태 관리하는법
    1) 전환할 컴포넌트 준비하기(BoardInsert, BoardList)
    2) 레이아웃상태를 state로 저장시키기
    3) state변경함수를 버튼 등의 요소에 부여
    4) state의 변경에 따른 레이아웃 지정
  */

  //  2) 레이아웃상태를 state로 저장시키기
  let [레이아웃, 레이아웃변경] = useState(0);  // 0 or 1로 state변경해줄 예정


  {/* 게시글 상세보기 */ }
  let [상세보기, 상세보기변경함수] = useState(null);

  let 등록페이지url = "/insert";


  let 모든데이터 = {
    게시글배열,
    게시글배열변경함수,
    상세보기,
    상세보기변경함수
    // 일반적으로 필요한 데이터만 보내줘야 함!!
  }

  /* 리액트훅함수 (1/17수)
    useEffect : 컴포넌트가 랜더링될 때를 감지하여 랜더링된 "이후" 실행할 코드를 기술하는 함수
                컴포넌트에는 기본적으로 lifeCycle이라는 개념이 있는데
                컴포넌트가 처음 로딩되는 시기를 mount
                state변경에 의해 컴포넌트가 재랜더링될 때는 update
                컴포넌트가 교체/소멸될 때는 unmout라고 한다.
      useEffect는 mount, update, unmount되는 시점에 각각 내가 실행하고자 하는 코드를 추가할 수 있다.

    * 사용방법
     useEffect( function() => {
        랜더링이 완료된 "후" 실행할 코드 // mount시에 무조건 1번은 실행됨
        return 컴포넌트가 재랜더링되거나 소멸할때 실행할 "함수" => return문은 생략가능하다.
     }, [의존성 목록])  // state값들을 배열형태로 넣어줌.
                          의존성목록에 들어간 state변수의 값이 바뀌면(update) 
                          useEffect내부의 함수가 다시 호출된다.
  */
  useEffect(function () {
    // 랜더링 후 실행됨(update)
    // axios.get('https://my-json-server.typicode.com/alsrudals2013/react/board')
    axios.get('/data/data.json', { data: "필요한데이터 아무거나 key:value 형태로 넣어주기" }) //기본경로:public폴더
      .then(function (result) {
        게시글배열변경함수(result.data);
        // console.log(result.data);
      }).catch((error) => console.log(error.response))
  }, []);
  /* 
    의존성 목록을 빈배열로 두는 경우 첫 로딩시에만 useEffect함수 내부의 내용이 실행된다.
    의존성 목록에 내가 원하는 데이터만 지정하는 경우 
    해당 데이터가 바뀔때만 useEffect함수 내부의 내용이 실행된다.
  */
  /*
    axios ? react에서 가장많이 사용되는 비동기 함수를 지원하는 라이브러리
            (json <-> js) 알아서 데이터를 파싱해준다.

    * 작성방법
    axios.get/post('url경로', {전달할데이터}).then( function(result){
      // 요청성공시 실행할 코드
    })
    .then
    .then
    .catch( function(error) {
      // 요청실패시 실행할 코드
    })
  */
  /*
    ContextApi : 복잡한 컴포넌트 구조에서 state상태를 손쉽게 전달하도록 도와주는 문법
        ex) App의 자식 BoardDetail의 자식 BoardDatailDetail에 데이터를 전달해야 한다?
          => props를 중첩으로 전달, 전달, ... 해주는 코드를 작성해야 함.
  */
  /*
    * store에서 데이터 꺼내오기
    useSelector : store에 저장되어 있는 state를 꺼내오는 함수
    let user = useSelector( (state) => {return state} );
  */
  // let user = useSelector((state) => { return state.user }); (==)
  let user = useSelector(({ user }) => { return user });
  let 전송 = useDispatch();

  let [loginModal, setLoginModal] = useState(false);

  function 모달창열기() {
    setLoginModal(true);
  }

  function 모달창닫기() {
    setLoginModal(false);
  }



  return (
    <div className="App">

      {/* jsx문법 내부에서의 주석 */}

      {/*
        {} : js요소

        JSX문법 
        js문법 내부에 html코드를 작성할 수 있는 문법을 jsx문법이라고 함.
        리액트에서 UI를 구성할 때 보편적으로 사용되는 방법으로 복잡한 코드 필요없이
        동적으로 추가되는 dom요소를 단순 코드선언으로 생성할 수 있게 도와준다.

        브라우저 콘솔창에서는 jsx문법을 해석하지 못한다.
      */}

      {/* 로그아웃 기능 만들기 -> user state를 없는 것으로 만들기
          로그아웃시 아래 유저정보대신 로그인 버튼이 보이게 작업    */}

      <div className='header'>
        <div className='header-1'>
          <h3 style={{ fontWeight: "bolder" }}>{제목2}</h3>
        </div>
        <div className='header-2'>
          {
            user ? (
              <>
                <img src={user.profile} onClick={() => 전송(프로필랜덤변경())} />
                <div className='user-info'>
                  <span className='user-nickname' >{user.nickname}</span>
                  <span className='user-email' >{user.email}</span>
                </div>
                <button onClick={() => 전송(로그아웃())}>로그아웃</button>
              </>
            ) :
              // <button onClick={() => 모달창열기()}>로그인</button>
              <button onClick={() => navi("/auth/login")}>로그인</button>
          }
        </div>
      </div>

      <div className='nav'>
        {/* 
          리액트방식 event 부여방법
          onClick={함수}

          ex> 콘솔로그?
          onClick={() =? console.log(1)}
          * 주의점 : 무조건 함수자료형값만 넣어줘야 함. 함수호출한 결과값을 널어주면 의미가 없음
        
        */}
        <button onClick={제목2변경}>제목변경 테스트</button>
        {/* <button onClick={function () {
          레이아웃변경(0);  // UI상태관리 3)번...
        }}>게시판</button>
        <button onClick={function () {
          레이아웃변경(1);
        }}>게시글등록</button> */}

        {/* Route 사용시 --> Link 사용 url주소를 생성함 */}
        <Link to="board/list">게시판</Link>
        <Link to={"board" + 등록페이지url}>게시글등록</Link>
        <Link to={"chat/list"}>채팅방</Link>
      </div>


      <Context.Provider value={{ 모든데이터 }}>
        <Routes>
          <Route path='/' element={<BoardList 모든데이터={모든데이터} />} />
          <Route path="/board" element={<Outer />}>
            {/* '/board/list' ... 중첩라우팅 이라고 함 */}
            <Route path='list' element={<BoardList 모든데이터={모든데이터} />} />
            <Route path='insert' element={<BoardInsert 모든데이터={모든데이터} />} />
            {/* <Route path='detail' element={<BoardDetail 모든데이터={모든데이터} />} /> */}
            {/* 
            * 라우트 파라미터 문법 *
            /:매개변수명 -> 중첩으로 여러개 작성 가능함

          */}
            <Route path='detail/:bno' element={<BoardDetail 모든데이터={모든데이터} />} />
            <Route path='update/:bno' element={<BoardUpdate 모든데이터={모든데이터} />} />
          </Route>

          <Route path='/chat'>
            <Route path='list' element={<ChattingRoomList />} />
            <Route path='detail/:chatRoomNo' element={<ChattingRoom />} />
          </Route>
          <Route path='/auth' >
            <Route path='login' element={<KakaologinFrom />} />
          </Route>

          <Route path='*' element={
            <div>
              <h1 style={{ color: "red" }}>존재하지 않는 페이지입니다.</h1>
              <Link to="/" >메인으로 돌아가기</Link>
            </div>
          } />
        </Routes>
        {
          // loginModal == true ? <LoginModal /> : null  
          // loginModal && <LoginModal 모달창닫기={모달창닫기} />  // 위와 동일한 의미임
        }
      </Context.Provider>

      {/* {
        레이아웃 == 0 ?
          <BoardList 상세보기변경함수={상세보기변경함수} 게시글배열={게시글배열} 게시글배열변경함수={게시글배열변경함수} 레이아웃변경={레이아웃변경} /> :
          레이아웃 == 1 ?
            <BoardInsert 게시글배열={게시글배열} 게시글배열변경함수={게시글배열변경함수} /> :
            레이아웃 == 2 ?
              <BoardDetail 레이아웃변경={레이아웃변경} 상세보기={상세보기} /> :
              레이아웃 == 3 ?
                <BoardUpdate 레이아웃변경={레이아웃변경} 상세보기={상세보기} 상세보기변경함수={상세보기변경함수} 게시글배열={게시글배열} 게시글배열변경함수={게시글배열변경함수} /> :
                null
      } */}


    </div>
  );
}

export default App;

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import Ptest1 from './Ptest1';
import { Provider } from 'react-redux';
import store from './store';


/*
  index.html에 존재하는 id값이 'root' 노드를 선택한 후 최상위요소로 만듬
  root엘리먼트는 화면을 그려주는 render()함수를 가지고 있으며
  매개변수로 "리액트요소"를 추가했을때 화면에 그려준다

  일반 html요소 -> <div>, <p>, ..
  리액트요소 -> <App/>

*/

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>

  /* 
    App : 리액트요소
    root엘리먼트 내부에 App컴포넌트를 랜더링해줌
  
    리액트요소는 반드시 대문자로 시작해야 함.
  */


);


import { Outlet } from "react-router-dom";

export default function Outer() {

    return (
        <div className="outer">
            <br />
            <Outlet></Outlet> {/* 자식컴포먼트를 여기에 넣겠다는 뜻*/}

        </div>
    )
}
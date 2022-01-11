"use strict";

// DOM을 활용하여 HTMl에 있는 값에 접근
const id = document.querySelector("#id"),
     pwd = document.querySelector("#pwd"),
     loginBtn = document.querySelector("#button");

loginBtn.addEventListener("click", login);

function login() {
    if(!id.value) return alert("아이디를 입력해주십시오.");
    if(!pwd.value) return alert("비밀번호를 입력해주십시오.");
    
    const req = {
        id: id.value,
        pwd: pwd.value,
    };

    fetch("/login", {
        method: "POST", // Restful API
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
    })
    .then((res) => res.json())
    // promise 반환값을 받아서 로그인 성공시 루트페이지로 실패시 경고창
    .then((res) => {
    if (res.success) {
        location.href = "/";
    } else {
        if (res.err) return alert(res.err);
        alert(res.msg);
    }
 })
 .catch((err) => {
    console.error("로그인 중 에러 발생");
});
}
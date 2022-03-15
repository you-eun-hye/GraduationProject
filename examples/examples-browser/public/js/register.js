const id = document.querySelector("#id"),
    pwd = document.querySelector("#pwd"),
    confirmPwd = document.querySelector("#confirmPwd")
    registerBtn = document.querySelector("#registerBtn");

registerBtn.addEventListener("click", register);

function register(){
    if(!id.value) return alert("아이디를 입력해주세요.");
    if(!pwd.value) return alert("비밀번호를 입력해주세요.");
    if(confirmPwd.value !== pwd.value) return alert("비밀번호를 다시 확인해주세요.");
}
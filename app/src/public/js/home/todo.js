const db = require("../config/db");
init();

function init(){
        document.querySelector('form').addEventListener('submit', todo);
        document.getElementById('clear').addEventListener('click', clearTodoList);
        document.querySelector('ul').addEventListener('click', deleteOrCheck);
}

function deleteOrCheck(e){
    if(e.target.className == 'delete')  
        deleteToDo(e); // X 버튼을 누르면 목록에서 항목 삭제
    else {
        checkToDo(e); // 체크박스를 클릭한 경우 글씨 색을 연하게 바꿔준다.
    }
}

// function start_timer(e){
//     if(e.target.className == 'js-timer'){
//         location.replace('../../views/home/timer.ejs');
//     }
// }

function deleteToDo(e){ // X 버튼을 누르면 목록에서 항목 삭제
    let remove = e.target.parentNode.parentNode;
    let parentNode = remove.parentNode;
    parentNode.removeChild(remove);
}
 
function checkToDo(e){  // 체크박스를 클릭한 경우 글씨 색을 연하게 바꿔준다.
    const todo = e.target.nextSibling;
    if(e.target.checked){
        todo.style.color = "#dddddd";
    }else {
        todo.style.color = "#000000";
    }
}

function clearTodoList(e){ //목록 전체 삭제하는 경우
    let ul = document.querySelector('ul').innerHTML = '';
}

function todo(e){ //새로운 할 일 추가하는 경우
    const req = {
        todo: todo.value,
    };

    fetch("/todo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
    })
    .then((res) => res.json())
    .then((res) => {
        if (res.success) {
            e.preventDefault();
            let toDoValue = document.querySelector('input');
            if(toDoValue.value !== '')
                addTask(toDoValue.value);
                toDoValue.value = ''; //입력창 비워주기
        } else {
            alert(res.msg);
        }
    })
    .catch((err) => {
        console.error("회원가입 중 에러 발생");
    });

    // e.preventDefault();
    // let toDoValue = document.querySelector('input');
    // if(toDoValue.value !== '')
    //     addTask(toDoValue.value);
    //     toDoValue.value = ''; //입력창 비워주기
}

function addTask(value){
    let ul = document.querySelector('ul');
    let li = document.createElement('li');
    li.innerHTML = `<input type="checkbox"><label>${value}</label><span class="right"><button class="js-timer">00:00:00</button><span class="delete">x</span></span>`;
    ul.appendChild(li);
    document.querySelector('.todolist').style.display = 'block';
}
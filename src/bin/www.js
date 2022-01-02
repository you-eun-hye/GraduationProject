"use strict"

const app = require("../app");
const PORT = 3000;

// port 3000번으로 서버가 돌아가면 실행
app.listen(PORT, () => {
    console.log('서버 가동');
})
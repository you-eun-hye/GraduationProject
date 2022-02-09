"use strict";

const app = require("../../app");
const PORT = process.env.PORT || 3000; // PORT 환경변수가 있을때는 해당 포트에서 동작, 없으면 3000으로 적용

app.listen(PORT, () => {
    console.log(`${PORT} 포트에서 서버가 가동되었습니다.`);
});
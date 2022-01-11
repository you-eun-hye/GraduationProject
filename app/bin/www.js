"use strict";
// 서버 실행 파일
// 다 듣고 35 다시 보기 

const app = require("../../app");
const logger = require("../src/config/logger");

const PORT = process.env.PORT || 3000; // PORT 환경변수가 있을때는 해당 포트에서 동작, 없으면 3000으로 적용

app.listen(PORT, () => {
    logger.info(`${PORT} 포트에서 서버가 가동되었습니다.`);
});
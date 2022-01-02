// 라우팅 분리
"use strict";

const express = require("express");
const router = express.Router();

const ctrl = require("./home.ctrl")

// 서버가 돌아가고 보이는 메인(루트)페이지
router.get("/",ctrl. hello)

router.get("/login", ctrl.login)

module.exports = router;
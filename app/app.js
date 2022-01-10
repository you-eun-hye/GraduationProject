"use strict";
// 서버의 기본 설정들

// 모둘
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require ("dotenv"); // 환경 변수 관리
dotenv.config();

const app = express();

// 라우팅
const home = require("./src/routes/home");

// 앱세팅
app.set("views", "./src/views"); // view engine 위치 설정
app.set("view engine", "ejs"); // view engine을 ejs로 설정
app.use(express.static(`${__dirname}/src/public`)); // 현 위치(app.js)에 src 폴더안에 public 폴더를 정적경로로 미들웨어 등록

app.use(bodyParser.json());
// URL을 통해 전달되는 데이터에 한글, 공백 등과 같은 문자가 포함될 경우 제대로 인식되지 않는 문제 해결
app.use(bodyParser.urlencoded({ extended: true}));

app.use("/", home); // use -> 미들웨어를 등록해주는 메서드

module.exports = app;

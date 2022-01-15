"use strict";

const logger = require("../../config/logger");
const User = require("../../models/User");

// 컨트롤러 함수들
const output = {
    hello: (req, res) => {
        logger.info('GET / 304 "홈 화면으로 이동');
        res.render("home/todo");
    },

    login: (req, res) => {
        logger.info('GET / login 304 "로그인 화면으로 이동');
        res.render("home/login");
    },
    register: (req, res) => {
        logger.info('GET / register 304 "회원가입 화면으로 이동');
        res.render("home/register");
    },
};

const process = {
    login: async (req, res) => {
        const user = new User(req.body); // user 클래스 + req 정보 -> 인스턴스화
        const response = await user.login();

        const url =  {
            method: "POST",
            path: "/login",
            status: response.err ? 400 : 200,
        };

        log(response, url);
        return res.status(url.status).json(response);
    },
    register: async (req, res) => {
        const user = new User(req.body);
        const response = await user.register();

        const url =  {
            method: "POST",
            path: "/register",
            // 서버측 에러(DB 등)이 발생할 경우의 반환할 상태코드이므로 사실 500번대를 반환하는 것이 맞지만
            // 수정할 것이 많으므로 이렇게 작성함
            status: response.err ? 409 : 201,
        };

        log(response, url);
        return res.status(url.status).json(response);
    },
};

module.exports = {
    output,
    process,
};

const log = (response, url) => {
    if (response.err) {
        logger.error(
            `${url.method} / ${url.path} ${url.status} Response: ${response.success}, ${response.err}`
        );
    }
    else {
        logger.info(
            `${url.method} / ${url.path} ${url.status} Response: ${response.success}, ${
                response.msg || ""
            }`
        );
    }
}
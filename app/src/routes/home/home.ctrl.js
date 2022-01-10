"use strict";

const User = require("../../models/User");

// 컨트롤러 함수들
const output = {
hello: (req, res) => {
    res.render("home/index");
},

login: (req, res) => {
    res.render("home/login");
},
register: (req, res) => {
    res.render("home/register");
}
};

const process = {
    login: async (req, res) => {
     const user = new User(req.body); // user 클래스 + req 정보 -> 인스턴스화
     const response = await user.login();
     return res.json(response);
    },
    register: async (req, res) => {
     const user = new User(req.body);
     const response = await user.register();
     return res.json(response);
    },
};

module.exports = {
    output,
    process,
};


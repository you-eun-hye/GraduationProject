// MVC의 C(controller) 분리
"use strict"

const hello = (req, res) => {
    res.render("home/index");
};

const login = (req, res) => {
    res.render("home/login")
};

module.exports = {
    hello,
    login,
};
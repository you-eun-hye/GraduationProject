"use strict";

const express = require("express");
const router = express.Router();

const ctrl = require("./home.ctrl");

router.get("/todo", ctrl.output.todo);
router.get("/", ctrl.output.login);
router.get("/register", ctrl.output.register);
router.get("/timer", ctrl.output.timer);

//
router.post("/todo", ctrl.process.todo);
//
router.post("/login", ctrl.process.login);
router.post("/register", ctrl.process.register);

module.exports = router;
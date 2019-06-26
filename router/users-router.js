const express = require("express");
const usersRouter = express.Router();
const { getUser } = require("../controllers");

usersRouter.route("/:username").get(getUser);

module.exports = { usersRouter };

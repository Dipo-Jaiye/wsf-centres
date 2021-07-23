const router = require("express").Router();
const { register } = require("../controllers/usersController");
const { retrieve } = require("../controllers/centreController");
const User = require('../models/user');


    router.get("/register", retrieve, register);


module.exports = router;

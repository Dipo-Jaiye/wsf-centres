const router = require("express").Router();
const {index} = require("../controllers/homeController");
const {retrieve, search} = require("../controllers/centreController");

router.get("/", retrieve, index);

module.exports = router;

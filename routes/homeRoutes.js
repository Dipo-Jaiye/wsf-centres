const router = require("express").Router();
const {index} = require("../controllers/homeController");
const {retrieve} = require("../controllers/centreController");

router.get("/", retrieve, index);

module.exports = router;
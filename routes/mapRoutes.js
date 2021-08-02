const router = require("express").Router();
const {show, stringify} = require("../controllers/mapController");
const {retrieve} = require("../controllers/centreController");

router.get("/", retrieve, stringify, show);

module.exports = router;
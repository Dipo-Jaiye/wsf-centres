const router = require("express").Router();
const {show, stringify} = require("../controllers/mapController");
const {retrieve} = require("../controllers/centreController");

router.use("/", retrieve, stringify, show);

module.exports = router;
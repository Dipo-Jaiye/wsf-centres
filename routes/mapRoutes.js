const router = require("express").Router();
const {show} = require("../controllers/mapController");
const {retrieve} = require("../controllers/centreController");

router.use("/", retrieve, show);

module.exports = router;
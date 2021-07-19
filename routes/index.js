const router = require("express").Router();
const home = require("./homeRoutes");
const centre = require("./centreRoutes");
const map = require("./mapRoutes");
const {notFound,internalServerError} = require("../controllers/errorController");

router.use("/centre",centre);
router.use("/map",map);
router.use("/",home);
router.use(notFound);
router.use(internalServerError);

module.exports = router;
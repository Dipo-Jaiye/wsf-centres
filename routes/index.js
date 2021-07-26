const router = require("express").Router();
const {authCheck} = require("../middlewares/authMiddleware");
const home = require("./homeRoutes");
const centre = require("./centreRoutes");
const map = require("./mapRoutes");
const users = require("./usersRoutes")
const {notFound, internalServerError} = require("../controllers/errorController");

router.use(authCheck);
router.use("/", home);
router.use("/centre",centre);
router.use("/map",map);
router.use("/users", users);
router.use(notFound);
router.use(internalServerError);

module.exports = router;

const router = require("express").Router();
const { register, registerView, login, loginView, logout, show, edit, update, del } = require("../controllers/usersController");

router.get("/new", registerView);
router.get("/login", loginView);
router.get("/logout", logout);
router.get("/edit", edit);
router.get("/profile", show);
router.post("/create", register);
router.post("/login", login);
router.put("/update", update);
router.delete("/delete", del);

module.exports = router;
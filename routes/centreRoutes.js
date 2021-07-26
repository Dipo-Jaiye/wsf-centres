const router = require("express").Router();
const override = require("method-override");
const {create, edit, record, update, retrieve, location_edit, location_update} = require("../controllers/centreController");

router.use(override("_m",{methods:["POST"]}));
router.get("/", record);
router.get("/locate/edit", retrieve, location_edit);
router.get("/:id/edit", edit);
router.post("/", create);
router.put("/update", update);
router.put("/locate/edit", location_update);

module.exports = router;
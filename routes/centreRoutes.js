const router = require("express").Router();
const override = require("method-override");
const {create,edit,record,show, locate, retrieve, location_edit, location_update} = require("../controllers/centreController");

// router.get("/seed",seed);
router.use(override("_m",{methods:["POST"]}))
router.get("/locate", retrieve, locate);
router.get("/locate/edit", location_edit);
router.get("/:id/edit", show);
router.get("/", record);
router.put("/locate/edit", location_update);
router.post("/", create);
router.put("/update", edit);


module.exports = router;
const router = require("express").Router();
const { create, getAll, getOne, delDevice } = require("../controllers/deviceController");
const checkRole = require("../middleware/checkRoleMiddleware");

router.post("/", checkRole("ADMIN"), create);
router.get("/", getAll);
router.get("/:id", getOne);
router.get("/:id", delDevice);


module.exports = router;

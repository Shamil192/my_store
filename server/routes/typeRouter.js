const router = require("express").Router();
const { create, getAll } = require("../controllers/typeController");

const checkRole = require("../middleware/checkRoleMiddleware");

router.post("/", checkRole("ADMIN"), create);
router.get("/", getAll);

module.exports = router;

const Router = require("express");
const router = new Router();
const NewsController = require("../controllers/newsController");
const checkRole = require("../middleware/checkRoleMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, NewsController.create);
router.get("/", NewsController.getAll);
router.get("/:id", NewsController.getOne);

module.exports = router;

var express = require("express");
const UserController = require("../controllers/UserController");
var router = express.Router();

router.post("/login", UserController.login);
router.put("/:address", UserController.update);
router.get("/:address", UserController.userDetail);

module.exports = router;
var express = require("express");
const NFTController = require("../controllers/NFTController");

var router = express.Router();

router.get("/", NFTController.nftList);
router.get("/:tokenId", NFTController.nftDetail);
router.post("/", NFTController.nftStore);
router.delete("/:tokenId", NFTController.nftDelete);


module.exports = router;
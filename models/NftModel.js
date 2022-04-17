var mongoose = require("mongoose");

var NftSchema = new mongoose.Schema({
	tokenId: {type: Number, required: true},
    name: {type: String, required: true, default: 'unname'},
	description: {type: String, required: false},
    image: {type: String, required: true},
}, {timestamps: true});


module.exports = mongoose.model("Nft", NftSchema);
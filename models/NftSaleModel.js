var mongoose = require("mongoose");

var NftSaleSchema = new mongoose.Schema({
	tokenId: {type: Number, required: true},
    name: {type: String, required: true, default: 'unname'},
	description: {type: String, required: false},
    price: {type: String, required: true},
    paymentMethod: {type: String, required: true},
    isAuction: {type: String, required: false},
    duration: {type: String, required: false},
	isSold: {type: Boolean, required: true, default: 0},
	status: {type: Boolean, required: true, default: 1},
    nft: {type: mongoose.Schema.ObjectId, ref: "Nft", required: true },
    nftOwner: {type: mongoose.Schema.ObjectId, ref: "NftUser", required: true },
    nftCollection: {type: mongoose.Schema.ObjectId, ref: "NftCollection", required: false},
}, {timestamps: true});

module.exports = mongoose.model("NftForSale", NftSaleSchema);
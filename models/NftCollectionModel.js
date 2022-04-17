var mongoose = require("mongoose");

var NftCollectionSchema = new mongoose.Schema({
	name: {type: String, required: true, default: 'unname'},
    description: {type: String, required: false},
    thumbnail: {type: String, required: false},
    background: {type: String, required: false},
	url: {type: String, required: false},
    websiteHandle: {type: String, required: false},
    twitterHandle: {type: String, required: false},
    discordHandle: {type: String, required: false},
    instagramHandle: {type: String, required: false},
    mediumHandle: {type: String, required: false},
    telegramHandle: {type: String, required: false},
    royalties: {type: String, required: false},
	walletAddress: {type: String, required: false},
}, {timestamps: true});


module.exports = mongoose.model("NftCollection", NftCollectionSchema);
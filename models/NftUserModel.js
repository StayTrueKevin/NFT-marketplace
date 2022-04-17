var mongoose = require("mongoose");

var NftUserSchema = new mongoose.Schema({
	userName: {type: String, required: true, default: 'unname'},
    description: {type: String, required: false},
    userAvatar: {type: String, required: false},
    userBackground: {type: String, required: false},
	email: {type: String, required: false},
	signature: {type: String, required: false},
    address: {type: String, required: true},
    websiteHandle: {type: String, required: false},
    twitterHandle: {type: String, required: false},
    discordHandle: {type: String, required: false},
    instagramHandle: {type: String, required: false},
    mediumHandle: {type: String, required: false},
    telegramHandle: {type: String, required: false},
	isConfirmed: {type: Boolean, required: true, default: 0},
	status: {type: Boolean, required: true, default: 1}
}, {timestamps: true});


module.exports = mongoose.model("NftUser", NftUserSchema);
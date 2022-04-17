const NftSaleModel = require("../models/NftSaleModel");
const NftUserModel = require("../models/NftUserModel");
const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const { validateSignature } = require("../middlewares/signature");
var mongoose = require("mongoose");



// Nft User Schema
function NftUserData(data) {
	this.id = data._id;
	this.userName = data.userName;
	this.description = data.description;
	this.userAvatar = data.userAvatar;
	this.userBackground = data.userBackground;
	this.email = data.email;
	this.signature = data.signature;
	this.address = data.address;
	this.websiteHandle = data.websiteHandle;
	this.twitterHandle = data.twitterHandle;
	this.discordHandle = data.discordHandle;
	this.instagramHandle = data.instagramHandle;
	this.mediumHandle = data.mediumHandle;
	this.telegramHandle = data.telegramHandle;
	this.isConfirmed = data.isConfirmed;
	this.status = data.status;
	this.createdAt = data.createdAt;
}



/**
 * User store.
 * 
 * @param {string}      address 
 * @param {string}      name
 * @param {string}      description
 * 
 * @returns {Object}
 */
 exports.login = [
	body("address", "address must not be empty.").isLength({ min: 1 }).trim(),
	sanitizeBody("*").escape(),
	async (req, res) => {
		try {

            console.log('request params: ', req.body);
			const errors = validationResult(req);

			const user = await NftUserModel.findOne({address: req.body.address},"_id tokenId name description iamge")
            
            if(user){
                return apiResponse.successResponseWithData(res,"user add Success.", user);
            }else{
                var nftUser = new NftUserModel(
                    { 
                        address: req.body.address
                    });
    
                if (!errors.isEmpty()) {
                    return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
                }else {
                    //Save nft.
                    nftUser.save(function (err) {
                        if (err) { return apiResponse.ErrorResponse(res, err); }
                        let userData = new NftUserData(nftUser);
                        return apiResponse.successResponseWithData(res,"user add Success.", userData);
                    });
                }
            }

			
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];


/**
 * User update.
 * 
 * @param {string}      address 
 * @param {string}      name
 * @param {string}      description
 *  ....
 * @returns {Object}
 */
 exports.update = [
    validateSignature,
	body("address", "address must not be empty.").isLength({ min: 1 }).trim(),
	sanitizeBody("*").escape(),
	// async (req, res) => {
	// 	try {

    //         console.log('This is Update function', req.body);
	// 		const errors = validationResult(req);

			

			
	// 	} catch (err) {
	// 		//throw error in json response with status 500. 
	// 		return apiResponse.ErrorResponse(res, err);
	// 	}
	// },

	(req, res) => {
		try {
			const errors = validationResult(req);
			var nftUser = new NftUserModel(
				{
					// title: req.body.title,
					// description: req.body.description,
					// isbn: req.body.isbn,
					// _id:req.params.id,
					userName: req.body.userName,
					description: req.body.description,
					userAvatar: req.body.userAvatar,
					userBackground: req.body.userBackground,
					email: req.body.email,
					signature: req.body.signature,
					address: req.body.address,
					websiteHandle: req.body.websiteHandle,
					twitterHandle: req.body.twitterHandle,
					discordHandle: req.body.discordHandle,
					instagramHandle: req.body.instagramHandle,
					mediumHandle: req.body.mediumHandle,
					telegramHandle: req.body.telegramHandle,
					isConfirmed: req.body.isConfirmed,
					status: req.body.status,
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				NftUserModel.findOne({address: req.body.address}, function (err, foundUser) {
					if(foundUser === null){
						return apiResponse.notFoundResponse(res,"User not exists with this address");
					}else{
						//Check authorized user
						console.log('found user: ', foundUser);
						// if(foundUser.user.toString() !== req.user._id){
						// 	return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
						// }else{
						// 	//update book.
						nftUser._id = foundUser._id;
						NftUserModel.findByIdAndUpdate(foundUser._id, nftUser, {},function (err) {
							
							if (err) {
								return apiResponse.ErrorResponse(res, err); 
							}else{
								let nftUserData = new NftUserModel(nftUser);
								return apiResponse.successResponseWithData(res,"user update Success.", nftUserData);
							}
						});
						// }
					}
				});

			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * NFTUser Detail.
 * 
 * @param {string}      address
 * 
 * @returns {Object}
 */
 exports.userDetail = [
	function (req, res) {
		try {
			NftUserModel.findOne({address: req.params.address},"_id userName description userAvatar userBackground email signature address websiteHandle twitterHandle discordHandle instagramHandle mediumHandle telegramHandle isConfirmed createdAt").then((nftUser)=>{                
				if(nftUser !== null){
					let nftUserData = new NftUserData(nftUser);
					return apiResponse.successResponseWithData(res, "Operation success", nftUserData);
				}else{
					return apiResponse.successResponseWithData(res, "Operation success", {});
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];


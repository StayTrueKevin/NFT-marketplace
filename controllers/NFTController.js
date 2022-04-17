const NftSaleModel = require("../models/NftSaleModel");
const NftModel = require("../models/NftModel");
const NftUserModel = require("../models/NftUserModel");
const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
var mongoose = require("mongoose");

const { ethers } = require("ethers");
const Web3 = require("web3");

const { 
	CONTRACTS, 
	IS_MAINNET, 
	HTTP_PROVIDER_URL 
} = require("../constants/contracts");
const { NFT_MARKETPLACE_ABI, NFT_AUCTION_ABI } = require("../constants/abi");

// Nft Schema
function NftData(data) {
	this.id = data._id;
	this.tokenId = data.tokenId;
	this.name = data.name;
	this.description = data.description;
	this.price = data.price;
	this.paymentMethod = data.paymentMethod;
	this.isAuction = data.isAuction;
	this.duration = data.duration;
	this.isSold = data.isSold;
	this.status = data.status;
	this.nft = data.nft;
	this.nftOwner = data.nftOwner;
	this.nftCollection = data.nftCollection;
	this.createdAt = data.createdAt;
}


mongoose.set("useFindAndModify", false);

/**
 * Nft List.
 * 
 * @returns {Object}
 */
exports.nftList = [
	async function (req, res) {
		try {
			NftSaleModel.find({}, "_id tokenId name description price paymentMethod isAuction duration isSold status nft nftOwner nftCollection createdAt")
				.populate('nft')
				.populate('nftOwner')
				.then((nfts)=>{
					if(nfts.length > 0){
						return apiResponse.successResponseWithData(res, "Operation success", nfts);
					}else{
						return apiResponse.successResponseWithData(res, "Operation success", []);
					}
				});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];


/**
 * Nft by Token ID.
 * 
 * @returns {Object}
 */
 exports.nftDetail = [
	async function (req, res) {
		try {
			NftSaleModel.find({tokenId: req.params.tokenId}, "_id tokenId name description price paymentMethod isAuction duration isSold status nft nftOwner nftCollection createdAt")
				.populate('nft')
				.populate('nftOwner')
				.then((nfts)=>{
					if(nfts.length > 0){
						return apiResponse.successResponseWithData(res, "Operation success", nfts);
					}else{
						return apiResponse.successResponseWithData(res, "Operation success", []);
					}
				});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];


/**
 * Nft store.
 * 
 * @param {string}      tokenId 
 * @param {string}      name
 * @param {string}      description
 * 
 * @returns {Object}
 */
 exports.nftStore = [
	body("name", "Title must not be empty.").isLength({ min: 1 }).trim(),
	body("description", "Description must not be empty.").isLength({ min: 1 }).trim(),
	body("tokenId", "tokenId must not be empty").isLength({ min: 1 }).trim().custom((tokenId,{req}) => {
		return NftSaleModel.findOne({tokenId : tokenId}).then(nft => {
			if (nft) {
				return Promise.reject("That nft already exist with this token ID.");
			}
		});
	}),
	sanitizeBody("*").escape(),
	async (req, res) => {
		try {
			const errors = validationResult(req);

			const nft = await NftModel.findOne({tokenId: req.body.tokenId},"_id tokenId name description iamge").then((nft)=>{
				if(nft){
					return nft;
				}
			});

			var saleNft = new NftSaleModel(
				{ 
					tokenId: req.body.tokenId,
					name: req.body.name,
					description: req.body.description,
					price: req.body.price,
					paymentMethod: req.body.paymentMethod,
					isAuction: req.body.isAuction,
					duration: req.body.duration,
					isSold: false,
					nft: nft
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				//Save nft.
				saleNft.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					let nftData = new NftData(saleNft);
					return apiResponse.successResponseWithData(res,"nft add Success.", nftData);
				});
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];


/**
 * Nft Delete.
 * 
 * @param {string}      tokenId
 * 
 * @returns {Object}
 */
 exports.nftDelete = [
	function (req, res) {
		try {
			NftSaleModel.deleteOne({tokenId: req.params.tokenId}, function (err, nft) {
				if (err) { return apiResponse.ErrorResponse(res, err); }
				return apiResponse.successResponseWithData(res,"nft deleted Success.");
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];


/*
* Cron job functions
*/
exports.updateNFT = [
	async function (nftData) {
		NftSaleModel.find({tokenId: nftData.tokenID},"_id tokenId name description price paymentMethod isAuction duration isSold status nft createdAt").then(async (nfts)=>{
			if(nfts.length > 0){
				console.log('find nft: ', nfts)
				
			}else{
				const genNft = await NftModel.find({tokenId: nftData.tokenID}, "_id tokenId name description iamge");
				const nftOwner = await NftUserModel.findOne({address: nftData.owner});
				
				if(genNft.length > 0 && nftOwner){
					console.log('find nft: ', genNft)
					const newNft = new NftSaleModel(
						{
							tokenId: nftData.tokenID,
							name: nftData.name,
							description: nftData.description,
							price: nftData.price,
							paymentMethod: nftData.paymentMethod,
							isAuction: false,
							isSold: false,
							nft: genNft[0]._id,
							nftOwner: nftOwner._id
						}
					);
					newNft.save();
				}
			}
		});
	}
]


exports.insertNFTs = [
	async function (nftData) {
		NftModel.find({tokenId: nftData.tokenId},"_id tokenId name description iamge").then((nfts)=>{
			if(nfts.length > 0){
				console.log('find nft: ', nfts)
				
			}else{
				console.log('nftData: ', nftData);
				const newNft = new NftModel(
					{
						tokenId: nftData.tokenId,
						name: nftData.name,
						description: nftData.description,
						image: nftData.image
					}
				);

				newNft.save();
			}
		});
	}
]
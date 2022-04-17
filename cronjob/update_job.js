const { ethers } = require("ethers");
const Web3 = require("web3");
const axios = require('axios');

const NFTController = require("../controllers/NFTController");
const { 
	CONTRACTS, 
	IS_MAINNET, 
	HTTP_PROVIDER_URL 
} = require("../constants/contracts");
const { NFT_MARKETPLACE_ABI, NFT_AUCTION_ABI, NFT_ABI } = require("../constants/abi");

export async function getNFTs() {
    const provider = new Web3(new Web3.providers.HttpProvider(HTTP_PROVIDER_URL));
    const marketplaceInstance  = new provider.eth.Contract(NFT_MARKETPLACE_ABI, CONTRACTS.MARKETPLACE);
    const nftIDsOfSale = await marketplaceInstance.methods.getNFTList().call();
    
    nftIDsOfSale.forEach(async nftID => {
        const nftData = await marketplaceInstance.methods.getNFTProdByTokenID(nftID).call();
        NFTController.updateNFT[0](nftData);
    });
}


export async function getAllNFTs() {
    const provider = new Web3(new Web3.providers.HttpProvider(HTTP_PROVIDER_URL));
    const nftInstance = new provider.eth.Contract(NFT_ABI, CONTRACTS.NFT);
    const totalSupply = await nftInstance.methods.totalSupply().call();

    for (let index = 0; index < totalSupply; index++) {
        const uri = await nftInstance.methods.tokenURI(index).call();
        axios.get(uri).then(async resp => {
            console.log('token ', index, ':', resp.data);
            const nftData = {
                tokenId: index,
                ...resp.data
            }
            NFTController.insertNFTs[0](nftData);
        }).catch(err=>{
            console.log('error: ', index);
        });
    }
}

import { ethers } from "ethers";
const msg = process.env.SING_MESSAGE;

export const validateSignature = async (req, resp, next) => {
    
    let { signature, address } = req.body;
    try {
        const signerAddr = await ethers.utils.verifyMessage(msg, signature);

        if (signerAddr == address) {
            next();
        } else {
            resp.status(500).send('Invalid signature');
        }
    } catch (err) {
        console.log(err);
        resp.status(500).send('Invalid signature');
    } 
}

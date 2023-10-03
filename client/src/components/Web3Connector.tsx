// Import everything
import { ethers } from "ethers";
import AMContractJson from '../../../hardhat/artifacts/contracts/AizuMujin.sol/AizuMujin.json';
import contractInfo from '../../../hardhat/artifacts/contracts/AizuMujin.sol/contractAddress.json';

export class Web3Connector{
    signer:any = 'test';
    provider:any;
    contract:any;
    async makeContract(){
        this.signer = null;
        this.provider;
        alert(this.signer);
        if (window) {
            // Connect to the MetaMask EIP-1193 object. This is a standard
            // protocol that allows Ethers access to make all read-only
            // requests through MetaMask.
            this.provider = new ethers.providers.Web3Provider(window.ethereum)

            // It also provides an opportunity to request access to write
            // operations, which will be performed by the private key
            // that MetaMask manages for the user.
            console.log(this.signer);
            this.signer = this.provider.getSigner();
            console.log(this.signer)
        }

        this.contract = new ethers.Contract(contractInfo.address, AMContractJson.abi, this.signer);
    }
    async _getSigner(){
        var signer = null;
        var provider;
        if (window.ethereum !== null) {
            // Connect to the MetaMask EIP-1193 object. This is a standard
            // protocol that allows Ethers access to make all read-only
            // requests through MetaMask.
            provider = new ethers.providers.Web3Provider(window.ethereum)

            // It also provides an opportunity to request access to write
            // operations, which will be performed by the private key
            // that MetaMask manages for the user.
            signer = await provider.getSigner();
        }
        return signer;
    }
}


// async function main(){
//     var provider = new ethers.providers.Web3Provider(window.ethereum);
//     var signer = provider.getSigner();
//     var contract = new ethers.Contract(contractInfo.address, abi, signer);
//     console.log(await contract.balanceOf());
//     console.log(await contract.getDeposit());
// }

// main();
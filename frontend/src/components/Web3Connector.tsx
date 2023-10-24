'use sta'
// Import everything
import { ethers } from "ethers";
import MujinContract from '../../../backend/artifacts/contracts/AizuMujin.sol/AizuMujin.json'
import MujinContractAdd from '../../../backend/artifacts/contracts/AizuMujin.sol/contractAddress.json'


export const _faucet = async()=>{
    if(typeof window.ethereum !== 'undefined'){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(MujinContractAdd.address, MujinContract.abi, signer);
        const fetch = async () => {
            const balance = await contract.connect(signer).faucet();
        }
        fetch();
    }
}
    export const _send = (getamount:string)=>{
        try{
            const amount = parseInt(getamount);
            if(typeof window.ethereum !== 'undefined'){
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(MujinContractAdd.address, MujinContract.abi, signer);
                const fetch = async () => {
                    const balance = await contract.connect(signer).send(amount);
                }
                fetch();
            }
        }catch(e){
        }
    }
    export const _fundTokens = (add:string)=>{
        if(typeof window.ethereum !== 'undefined'){
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(MujinContractAdd.address, MujinContract.abi, signer);
            const fetch = async () => {
                const balance = await contract.connect(signer).fundTokens(add,10);
            }
            fetch();
        }
    }
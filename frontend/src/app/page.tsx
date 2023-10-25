'use client';
import Image from 'next/image'
import {NextUIProvider} from "@nextui-org/react";
import {Button} from "@nextui-org/react";

import topImg from '/public/img/top.jpg';
import topTxtImg from '/public/img/top_txt.png';
import topLogo from '/public/img/logo.png';
import {FormEvent, useEffect, useState} from 'react';
import {
  ConnectWallet,
  ThirdwebProvider,
  metamaskWallet,
  paperWallet,
} from "@thirdweb-dev/react";

import Cardcompo from '@/components/Cardcompo';
import ContentsDescription from '@/components/ContentsDescription';

import { ethers } from "ethers";
import MujinContract from '../../../backend/artifacts/contracts/AizuMujin.sol/AizuMujin.json'
import MujinContractAdd from '../../../backend/artifacts/contracts/AizuMujin.sol/contractAddress.json'

export default function Home() {
  const color = 'warning';
  const clientid = process.env.NEXT_PUBLIC_PAPER_CLIENT_ID;
  let test: any;
  //web3--------------------------------
  const [balance,setMyBalance] = useState(-1);
  const [deposit,setDeposit] = useState(-1);
  
  

  useEffect(() => {
    const fetch = async () => {
      //Hookして値を取得したいときにモジュール化してもうまくいかないので都度宣言
      //Hookの必要のない呼び出しだけの関数はモジュール化しても良いのでWeb3Connectorに記述
      //HookするときにuseRefを使わなくてもuseStateで事足りる
      if(typeof window.ethereum !== 'undefined'){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(MujinContractAdd.address, MujinContract.abi, signer);
        setMyBalance(await contract.connect(signer).getMyBalance());
        setDeposit(await contract.connect(signer).getDeposit());
      }
    }
    fetch();
  }, [balance, setMyBalance,deposit,setDeposit]);
  
  //---------------------------
  return (
    <NextUIProvider>
    <ThirdwebProvider
    activeChain={process.env.NEXT_PUBLIC_CHAIN_ID}
    clientId = {process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
    supportedWallets={[
      metamaskWallet(),
      paperWallet({
        paperClientId: clientid? clientid : '',
      }),
    ]}
    >
    <header className='w-screen h-[60px] flex flex-row pt-2 mb-2'>
    <div className='absolute left-1 md:left-5 w-[80%] h-fit top-0'>
    <div className='flex-row flex w-full'>
    <Image
    src={topLogo}
    width={60}
    height={60}
    alt="Picture of the author"
    className='w-[60px] h-[60px] md:mt-2 mt-1'
    > 
    </Image>
    
    
    <span className='ml-2 mt-2 max-md:hidden md:text-[40px]'>
    会津大学技術勉強会
    </span>
    <Button radius="full" color='warning' className="capitalize mt-4 max-md:mt-2 ml-2 ">
    <span className='text-white'>TestNet / Demo</span>
    </Button>
    </div>
    </div>
    <div className='absolute w-[150px] md:right-16 right-1'>
    <ConnectWallet theme={"dark"} />
    </div>
    </header>
    <main className="flex min-h-screen flex-col items-center justify-between p-0 mb-10 md:p-2 w-screen">
    <div className='w-[100%] max-w-[1024px]'>
    <div>
    <Image
    src={topImg}
    width={800}
    height={800}
    alt="Picture of the author"
    className='w-screen'
    >
    </Image>
    </div>
    <div>
    <Image
    src={topTxtImg}
    width={80}
    height={500}
    alt="Picture of the author"
    className='w-[12%] min-w-[30px] max-w-[110px] absolute top-[90px] md:top-[120px]  pb-[1%] left-[47%] w3-animate-opacity'
    />
    </div>
    </div>
    <div className='w-[75%]'>
    <div className='w-full'>
    <ContentsDescription />
    </div>
    <div className='flex-row flex-wrap flex'>
    <Cardcompo balance={balance} deposit={deposit}/>
    </div>
    </div>
    </main>
    <footer className='h-[1000px] bg-slate-700'>test</footer>
    </ThirdwebProvider>
    </NextUIProvider>
    )
  }
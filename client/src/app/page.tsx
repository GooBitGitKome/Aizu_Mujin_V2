'use client';
import Image from 'next/image'
import {NextUIProvider} from "@nextui-org/react";
import {Button} from "@nextui-org/react";

import topImg from '/public/img/top.jpg';
import topTxtImg from '/public/img/top_txt.png';
import topLogo from '/public/img/logo.png';

import {
  ConnectWallet,
  ThirdwebProvider,
  metamaskWallet,
  paperWallet,
} from "@thirdweb-dev/react";

import Cardcompo from '@/components/Cardcompo';

export default function Home() {
  const color = 'warning'
  const clientid = process.env.NEXT_PUBLIC_PAPER_CLIENT_ID
  
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
      <header className='w-screen h-[60px] flex flex-row pt-2'>
          <div className='absolute left-1 md:left-5 w-[80%] h-full top-0'>
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
          <div className='absolute w-[150px] md:right-5 right-1'><ConnectWallet theme={"dark"} /></div>
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

            {/* Accodionにする */}
              <h2 className='font-jpfont '>会津無尽デモサイト</h2>
              <p>
              会津無尽へようこそ。このサイトは現在開発テスト段階です。<br />
              実際にご利用になりたい方は”Metamask”というアプリケーションを入れてください。<br />
              実際にAM_TOKENを手に入れるには管理者への問い合わせが必要です。<br />
              下記にご連絡ください。<br />
              </p>
              <h2 className='font-jpfont '>AMTとは</h2>
              <p>
              会津無尽へようこそ。このサイトは現在開発テスト段階です。<br />
              実際にご利用になりたい方は”Metamask”というアプリケーションを入れてください。<br />
              実際にAM_TOKENを手に入れるには管理者への問い合わせが必要です。<br />
              下記にご連絡ください。<br />
              </p>
            {/* ここまで */}
            
          </div>
          <div className='flex-row flex-wrap flex'>
            <Cardcompo />
          </div>
        </div>
      </main>
    <footer className='h-[1000px] bg-green-500'>test</footer>
    </ThirdwebProvider>
    </NextUIProvider>
  )
}

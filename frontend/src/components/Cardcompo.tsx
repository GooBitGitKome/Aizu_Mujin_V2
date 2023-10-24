'use client';
import {Card, CardHeader, CardBody, Input,Accordion, AccordionItem, Button} from "@nextui-org/react";
import cardsJson from '@/data/lib/function-info.json';

import {_faucet,_send,_fundTokens} from '@/components/Web3Connector';
import { FormEvent } from "react";

export default function Cardcompo({balance, deposit}: {balance:number, deposit:number}) {
    
    const myBalances:{[key:string]:number} = {
        "getMyBalance":balance,
        "getDeposit":deposit
    }

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e : FormEvent<HTMLFormElement>)=>  {
        // Prevent the browser from reloading the page
        e.preventDefault();
        // Read the form data
        const form = e.currentTarget;
        const formData = new FormData(form);
        console.log(formData.get('data'));
        console.log(formData.get('func'));
        //web3--------------------------------
        //Hookが必要ないのでモジュール化したものを呼び出す
        const func = formData.get('func')?.toString() || '';
        const data = formData.get('data')?.toString()|| '';
        switch(func){
        case 'faucet':
            console.log('check: faucet')
            await _faucet();
        break;
            case 'send':
            try{
                await _send(data);
            }catch(e){
                console.log(e);
                alert('適切な値を入力してください');
            }
        break;
            case 'fundTokens':
            try{
                await _fundTokens(data);
            }catch(e){
                console.log(e);
                alert('適切なアドレスを入力してください');
            }
        
        break;
        //-------------------------------------
        }

    }
    

    // make display function text
    const makeCards = cardsJson.map((card, evenNum = 0, index) => {
        evenNum++;
        //make the function in each cards
        let func = [];
        if(card.type == 'input'){
            func.push(<Input type='data' name='data' label={card.label} />);
            func.push(<input type='hidden' hidden name='func' value={card.function} />);//get function namexs
            func.push(
            <div className=" w-[90%] items-center flex-col flex">
            <Button type='submit' color="primary" className="w-[70%] mt-3" >  
            {card.button}
            </Button>
            </div>
            );
        }else if(card.type == 'button'){
            func.push(<Input type='data' disabled name='data' label={card.label} />);
            func.push(<input type='hidden' hidden name='func' value={card.function} />);//get function namexs
            func.push(
            <div className=" w-[90%] items-center flex-col flex">
            <Button type='submit' color="primary" className="w-[70%] mt-3" >  
            {card.button}
            </Button>
            </div>
            );
        }else if(card.type == 'display'){
            func.push(<Input type="email" disabled label={myBalances[card.function].toString()} />);
        }

        //make card's contents using the function`
        const cardContents =<>
        <form onSubmit={handleSubmit}>
        <CardHeader className='pb-0 pt-2 px-4 flex-col items-start'>
        <p className='text-lg uppercase font-bold'>{card.name}</p>
        <small className='text-default-500'>{card.description}</small>
        </CardHeader>
        <CardBody className='overflow-visible py-2 mb-2'>
        {func}
        </CardBody>
        </form>
        </>;
        //make the card using cardContents
        const cardHTML = []
        if(evenNum % 2 == 0){
            cardHTML.push(
                <>
                <Card className='my-5 max-md:w-full  w-[47%]'>
                {cardContents}      
                </Card>
                </>
            )
        }else{
            cardHTML.push(
                <>
                <Card className='my-5 max-md:w-full  w-[47%] '>
                {cardContents}  
                </Card>
                <div className='w-[6%]'></div>
                </>
                )
        }
        return cardHTML;
    });
    return makeCards;
}
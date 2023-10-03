'use client';
import React from "react";
import {Card, CardHeader, CardBody, Input,Accordion, AccordionItem, Button} from "@nextui-org/react";
import cardsJson from '@/data/lib/function-info.json';


export default function Cardcompo() {
    
    // make display function text
    const makeCards = cardsJson.map((card, evenNum = 0, index) => {
        evenNum++;
        //make the function in each cards
        let func = [];
        if(card.type == 'input'){
            func.push(<Input type="email"  label={card.label} />);
            func.push(
                <div className=" w-[90%] items-center flex-col flex">
                <Button color="primary" className="w-[70%] mt-3">
                {card.button}
                </Button>
                </div>
                );
            }else if(card.type == 'display'){
                func.push(<Input type="email" disabled/>);
            }
            //make card's contents using the function`
            const cardContents =<>
            <CardHeader className='pb-0 pt-2 px-4 flex-col items-start'>
            <p className='text-lg uppercase font-bold'>{card.name}</p>
            <small className='text-default-500'>{card.description}</small>
            </CardHeader>
            <CardBody className='overflow-visible py-2 mb-2'>
            {func}
            </CardBody>
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
                })
                return makeCards;
            }
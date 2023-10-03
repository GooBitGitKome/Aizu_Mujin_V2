'use client';
import React from "react";

import {Accordion, AccordionItem} from "@nextui-org/react";
import descriptionsJson from '@/data/lib/contents-info.json';

export default function ContentsDescription() {
    const makeDescriptions = descriptionsJson.map((content, index) => {
        let contentsHTML = [];

        contentsHTML.push(
            <AccordionItem
                key={index}
                aria-label="Accordion \{index\}"
                title={content.name}
            >
                {content.text}
            </AccordionItem>
        );

        return (
            <>
                <Accordion defaultExpandedKeys={["0"]}  variant="shadow">
                    {contentsHTML}
                </Accordion>
            </>
        );
    });
    return(
        <>
        {makeDescriptions}
        </>
    );
}

"use client"
import React, { useState, useRef } from "react";
import {
    Card,
    CardHeader,
    Spacer,
    Button,
    CardBody,
    Image
} from "@nextui-org/react";

interface ProfileCardProps {
    name: string;
    email: string;
    image: string;
}

export default function ProfileCard({ name, email, image }: ProfileCardProps) {

    const inputFile = useRef<HTMLInputElement>(null);

    const onImageClick = () => {
        if (inputFile.current !== null)
            inputFile.current.click();
    }

    return (
        <>
            <Card className=" align-middle items-center justify-center w-full">
                <CardHeader className="">
                    <div className="flex flex-row items-center">
                        <div className="w-1/3 items-center pr-5">
                            <Image className="shadow-lg border rounded-3xl hover:cursor-pointer w-12" src={image} onClick={() => {onImageClick()}}/>
                            <input type='file' id='file' ref={inputFile} style={{display: 'none'}}/>
                        </div>
                        <div className="flex flex-col align-left w-2/3">
                            <text className="text-xl font-bold">{name}</text>
                            <text className="text-m">{email}</text>
                        </div>
                    </div>
                </CardHeader>
            </Card>
        </>
    )
}
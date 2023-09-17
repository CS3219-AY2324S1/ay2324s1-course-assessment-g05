"use client";
import { Card, CardHeader, CardBody, Input, Button, Divider, Spacer } from "@nextui-org/react";
import React, { useState } from "react";

export default function ForgotPasswordComponent() {

    const [isSubmitted, setIsSubmitted] = useState(false);


    return (
        <div className="flex items-center justify-center h-screen">
            <Card className="items-center justify-center w-96 mx-auto pt-10 pb-10">
                <CardHeader className="justify-center font-bold">Forgot your password?</CardHeader>
                <CardBody className="flex flex-col space-y-10">
                    <Divider/>
                    <Spacer y={5}/>
                    <p>Enter your email address below:</p>
                    <form className="flex flex-col space-y-10">  
                        <Input placeholder="Email address"/>
                        <Button color="primary" onClick={() => {setIsSubmitted(true)}}>
                            Send reset password link
                        </Button>
                    </form>  
                    { isSubmitted ? <p className="text-success-500">A reset password email has been sent to your email address.</p> : null }
                </CardBody>
            </Card>
        </div>
    )
}
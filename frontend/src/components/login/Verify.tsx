"use client";
import { Card, CardHeader, CardBody, Input, Button, Divider, Spacer } from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import { CLIENT_ROUTES } from "@/common/constants";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyComponent() {
    // flags
    const [isVerificationFromEmailLink, setIsVerificationFromEmailLink] = useState(false);
    const [isSuccessfulVerification, setIsSuccessfulVerification] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const email = searchParams.get("email");
        const token = searchParams.get("token");

        if (email && token) {
            setIsVerificationFromEmailLink(true);
            // todo call some api to change user to verified
        }
    }, []);
    return (
        <div className="flex items-center justify-center h-screen">
            <Card className="items-center justify-center w-96 mx-auto pt-10 pb-10">
                {!isVerificationFromEmailLink && (
                    <>
                        <CardHeader className="justify-center font-bold">
                            Please check your email for verification.
                        </CardHeader>
                        <CardBody className="flex flex-col space-y-10">
                            <Divider />
                            <Spacer y={5} />
                            <p>You may now close this tab.</p>
                        </CardBody>
                    </>
                )}
                {isVerificationFromEmailLink && isSuccessfulVerification && (
                    <>
                        <CardHeader className="justify-center font-bold">
                            Verification success.
                        </CardHeader>
                        <CardBody className="flex flex-col space-y-10">
                            <Divider />
                            <Spacer y={5} />
                            <form className="flex flex-col space-y-10">
                                <Button
                                    color="primary"
                                    onClick={() => {
                                        router.push(CLIENT_ROUTES.LOGIN);
                                    }}
                                >
                                    Login now
                                </Button>
                            </form>
                        </CardBody>
                    </>
                )}
                {isVerificationFromEmailLink && !isSuccessfulVerification && (
                    <>
                        <CardHeader className="justify-center font-bold">
                            Verification failed.
                        </CardHeader>
                        <CardBody className="flex flex-col space-y-10">
                            <Divider />
                            <Spacer y={5} />
                            <p>
                                Please retry the link from your email. If this problem persists,
                                please contact admin.
                            </p>

                            {/* <form className="flex flex-col space-y-10">
                                <Button
                                    color="primary"
                                    onClick={() => {
                                        router.push(CLIENT_ROUTES.LOGIN);
                                    }}
                                >
                                    Back to login
                                </Button>
                            </form> */}
                        </CardBody>
                    </>
                )}
            </Card>
        </div>
    );
}

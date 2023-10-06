"use client";
import {
    Card,
    CardBody,
    Spacer,
    Button,
    Input,
    Checkbox,
    Link,
    Divider,
    CardHeader,
    Image,
} from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AuthService } from "@/helpers/auth/auth_api_wrappers";
import { ToastType } from "@/types/enums";
import displayToast from "@/components/common/Toast";

export default function ForgotPasswordComponent() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isChangePassword, setIsChangePassword] = useState(false); // redirected from email
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [checkPassword, setCheckPassword] = useState("");
    const [arePasswordsEqual, setArePasswordsEqual] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isCheckPasswordVisible, setIsCheckPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);
    const toggleCheckPasswordVisibility = () => setIsCheckPasswordVisible(!isCheckPasswordVisible);

    const router = useRouter();
    const searchParams = useSearchParams();

    async function sendPasswordResetEmail() {
        try {
            console.log(email);
            const res = await AuthService.sendPasswordResetEmail(email);
            if (res) {
                setIsSubmitted(true);
            }
        } catch (error) {
            displayToast("Something went wrong. Please refresh and try again.", ToastType.ERROR);
        }
    }

    useEffect(() => {
        setArePasswordsEqual(
            !(password !== checkPassword && password !== "" && checkPassword !== "")
        );

        if (password !== "" && checkPassword !== "" && password.length < 8) {
            setErrorMsg("Password should contain 8 characters or more.");
        } else if (!arePasswordsEqual) {
            setErrorMsg("Passwords do not match. Please try again.");
        } else {
            setErrorMsg("");
        }
    }, [password, checkPassword, setPassword, setCheckPassword, arePasswordsEqual]);

    useEffect(() => {
        const email = searchParams.get("email");
        const token = searchParams.get("token");

        if (email && token) {
            setIsChangePassword(true);
        }
    }, []);

    useEffect(() => {
        // call api that takes in email and generates a token that
        console.log("test");
    }, [isSubmitted]);

    return (
        <div className="flex items-center justify-center h-screen">
            <Card className="items-center justify-center w-96 mx-auto pt-10 pb-10">
                {!isChangePassword ? (
                    <>
                        <CardHeader className="justify-center font-bold">
                            Forgot your password?
                        </CardHeader>
                        <CardBody className="flex flex-col space-y-10">
                            <Divider />
                            <Spacer y={5} />
                            <p>Enter your email address below:</p>
                            <form className="flex flex-col space-y-10">
                                <Input
                                    placeholder="Email address"
                                    onInput={(e) => {
                                        setEmail(e.currentTarget.value);
                                    }}
                                />
                                <Button
                                    color="primary"
                                    onClick={() => {
                                        sendPasswordResetEmail();
                                    }}
                                >
                                    Send reset password link
                                </Button>
                            </form>
                            {isSubmitted ? (
                                <p className="text-success-500">
                                    A reset password email has been sent to your email address.
                                </p>
                            ) : null}
                        </CardBody>
                    </>
                ) : (
                    <>
                        <form className="w-1/2" onSubmit={() => {}}>
                            <CardHeader className="lg font-bold justify-center">
                                PeerPrep
                            </CardHeader>
                            <Spacer y={3} />
                            <Input
                                type={isPasswordVisible ? "text" : "password"}
                                placeholder="Password"
                                isClearable
                                isRequired
                                fullWidth
                                onInput={(e) => {
                                    setPassword(e.currentTarget.value);
                                }}
                                endContent={
                                    <Button
                                        variant="light"
                                        className="focus:outline-none p-2"
                                        size="sm"
                                        isIconOnly
                                        onClick={togglePasswordVisibility}
                                    >
                                        {isPasswordVisible ? (
                                            <Image src="/assets/eye-hide.svg" />
                                        ) : (
                                            <Image src="/assets/eye-show.svg" />
                                        )}
                                    </Button>
                                }
                            />
                            <div className="items-center">
                                <Spacer y={1} />
                                <Input
                                    type={isCheckPasswordVisible ? "text" : "password"}
                                    placeholder="Re-enter password"
                                    isClearable
                                    isRequired
                                    fullWidth
                                    onInput={(e) => {
                                        setCheckPassword(e.currentTarget.value);
                                    }}
                                    endContent={
                                        <Button
                                            variant="light"
                                            className="focus:outline-none p-2"
                                            size="sm"
                                            isIconOnly
                                            onClick={() => toggleCheckPasswordVisibility()}
                                        >
                                            {isCheckPasswordVisible ? (
                                                <Image src="/assets/eye-hide.svg" />
                                            ) : (
                                                <Image src="/assets/eye-show.svg" />
                                            )}
                                        </Button>
                                    }
                                />
                                <Spacer y={1} />
                                <div className="text-red-500 text-center text-xs font-bold">
                                    {errorMsg}
                                </div>
                            </div>
                            <Button
                                isLoading={isSubmitted}
                                type="submit"
                                color="primary"
                                className="w-1/2"
                            >
                                {isSubmitted ? null : <>Change</>}
                            </Button>
                        </form>
                    </>
                )}
            </Card>
        </div>
    );
}

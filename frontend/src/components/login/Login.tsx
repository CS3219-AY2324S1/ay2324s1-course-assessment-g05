"use client";
import React, { FormEvent, useEffect, useState } from "react";
import {
  Card,
  Spacer,
  Button,
  Input,
  Checkbox,
  Link,
  Divider,
  CardHeader,
  Image
} from "@nextui-org/react";
import PeerPrepLogo from "@/components/common/PeerPrepLogo"
import { createUser } from "@/helpers/user/user_api_wrappers";
import { CLIENT_ROUTES } from "@/common/constants";
import { useRouter } from "next/navigation";
import { requestToBodyStream } from "next/dist/server/body-streams";

export function LoginComponent() {

  const router = useRouter()

  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [name, setName] = useState("");
  const [isRemembered, setIsRemembered] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Flags
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isCheckPasswordVisible, setIsCheckPasswordVisible] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [arePasswordsEqual, setArePasswordsEqual] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [doesUserExist, setDoesUserExist] = useState(false);

  // Toggles
  const togglePasswordVisibility = () =>
    setIsPasswordVisible(!isPasswordVisible);
  const toggleCheckPasswordVisibility = () =>
    setIsCheckPasswordVisible(!isCheckPasswordVisible);
  const toggleSignUp = () => setIsSignUp(!isSignUp);

  useEffect(() => {
    setArePasswordsEqual(!(password !== checkPassword && (password !== "" && checkPassword !== "")));
    
    if (password !== "" && checkPassword !== "") {
      if (password.length < 8) {
        setErrorMsg("Password should contain 8 characters or more.");
      }
    } else {
      setErrorMsg("");
    }
  }, [password, checkPassword]);

  useEffect(() => {
    if (!(email.includes("@") && email.includes("."))) {
      setErrorMsg("Email is invalid. Please try again.");
    } else {
      setErrorMsg("");
    }
  }, [email])

  async function submitNewUser(e: FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      setIsSubmitted(true);
      let res = await createUser(name, email);
      if (res.ok) {
        router.push(CLIENT_ROUTES.HOME);
        return;
      } 
      
      if (res.status == 400) {
        setErrorMsg("User exists. Please login instead.");
      } else {
        throw new Error(res.message)
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsSubmitted(false);
    }
  }

  async function getUser(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // getUser
    setIsSubmitted(true);
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="items-center justify-center w-96 mx-auto pt-10 pb-10">
        <form className="w-1/2" onSubmit={ isSignUp ? submitNewUser : getUser }>
          <PeerPrepLogo />
          <CardHeader className="lg font-bold justify-center">
            PeerPrep
          </CardHeader>
          <Spacer y={3} />
          <Input
            isClearable
            isRequired
            fullWidth
            onInput={(e) => {
              setEmail(e.currentTarget.value);
            }}
            placeholder="Email"
          />
          <Spacer y={1} />
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
                  { isPasswordVisible ? <Image src="/eye-hide.svg"/> : <Image src="/eye-show.svg"/>}
                  
                </Button>
            }
          />
          {isSignUp ? (
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
                      { isCheckPasswordVisible ? <Image src="/eye-hide.svg"/> : <Image src="/eye-show.svg"/> }
                    </Button>
                }
              />
              <Spacer y={1} />
              <Input
                isClearable
                isRequired
                fullWidth
                onInput={(e) => {
                  setName(e.currentTarget.value);
                }}
                placeholder="Name"
              />
              {arePasswordsEqual ? (
                <Spacer y={6}/>
              ) : (
                <div className="text-red-500 text-center text-xs font-bold">
                  <Spacer y={2} />
                  Passwords do not match
                </div>
              )}
              <div className="text-red-500 text-center text-xs font-bold">{errorMsg}</div>
              <div className="flex flex-col items-center pt-5 space-y-5">
                <Button
                  isLoading={isSubmitted}
                  type="submit"
                  color="primary"
                  className="w-1/2"
                >
                  {isSubmitted ? null : <>Sign Up</>}
                </Button>
                <Link
                  className="cursor-pointer"
                  onClick={() => {
                    toggleSignUp();
                  }}
                >
                  Back to login
                </Link>
              </div>
            </div>
          ) : (
            <>
              <Spacer y={3} />
              <div className="flex justify-between">
                <Checkbox
                  size="sm"
                  onClick={() => {
                    setIsRemembered(true);
                  }}
                >
                  Remember me
                </Checkbox>
                <Button
                  className="focus:outline-none p-1"
                  type="submit"
                  isLoading={isSubmitted}
                  isIconOnly
                  aria-label="Submit"
                  size="sm"
                  color="primary"
                  onClick={() => {
                    setIsSubmitted(true);
                  }}
                  href="/verify"
                >
                  {!isSubmitted ? (
                    <Image src="submit_button.svg"/>
                  ) : (
                    null
                  )}
                </Button>
              </div>
              <Spacer y={5} />
              <div className="flex justify-between">
                <Link size="sm" href="#">
                  Forgot password?
                </Link>
                <Link
                  className="cursor-pointer"
                  size="sm"
                  onClick={() => {
                    toggleSignUp();
                  }}
                >
                  Sign Up
                </Link>
              </div>
              <Spacer y={5} />
              <Divider />
              <Spacer y={5} />
              <div className="flex items-center justify-between h-10 w-100%">
                <header className="text-xs">Sign in with:</header>
                <div className="flex justify-between space-x-5 p-x-5">
                  <Button className="p-2" isIconOnly variant="faded">
                    <Image src="/github.svg"/>
                  </Button>
                  <Button className="p-2" isIconOnly variant="faded">
                    <Image src="/google.svg"/>
                  </Button>
                </div>
              </div>
            </>
          )}
        </form>
      </Card>
    </div>
  );
}

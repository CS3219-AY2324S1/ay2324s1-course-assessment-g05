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
import { UserService } from "@/helpers/user/user_api_wrappers";
import { CLIENT_ROUTES } from "@/common/constants";
// import { useRouter } from "next/router";
import { useRouter, useParams } from "next/navigation"
import { PeerPrepErrors } from "@/types/PeerPrepErrors";
import User from "@/types/user";
import { Role } from "@/types/enums";
import { toast } from "react-toastify"

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

  // Toggles
  const togglePasswordVisibility = () =>
    setIsPasswordVisible(!isPasswordVisible);
  const toggleCheckPasswordVisibility = () =>
    setIsCheckPasswordVisible(!isCheckPasswordVisible);
  const toggleSignUp = () => setIsSignUp(!isSignUp);

  useEffect(() => {
    setArePasswordsEqual(!(password !== checkPassword && (password !== "" && checkPassword !== "")));
    
    if (password !== "" && checkPassword !== "" && password.length < 8) {
      setErrorMsg("Password should contain 8 characters or more.");
    } else if (!arePasswordsEqual) {
      setErrorMsg("Passwords do not match. Please try again.")
    } else {
      setErrorMsg("");
    }
  }, [password, checkPassword, setPassword, setCheckPassword, arePasswordsEqual]);

  useEffect(() => {
    if (!(email.includes("@") && email.includes(".")) && email !== "") {
      setErrorMsg("Email is invalid. Please try again.");
    } else {
      setErrorMsg("");
    }
  }, [email])

  async function submitNewUser(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitted(true);
    let user: User = {
      name: name,
      email: email,
      role: Role.USER,
    }

    try {      
      let res = await UserService.createUser(user);
      router.push(CLIENT_ROUTES.HOME); //TODO: Update with verifying OTP/Email address when auth
      sessionStorage.setItem("email", res.email);
    } catch (error) {
      if (error instanceof PeerPrepErrors.ConflictError) {
        toast.error("User already exists. Please login instead.", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          theme: "dark"
        })
      } else {
        console.log(error);
        toast.error("Something went wrong. Please refresh and try again.", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          theme: "dark"
        })
      }
    } finally {
      // Cleanup
      setIsSubmitted(false);
    }
  }

  async function getUser(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setIsSubmitted(true);
      let res = await UserService.getUserByEmail(email);
      if (res) {
        sessionStorage.setItem("email", res.email);
        router.push(CLIENT_ROUTES.HOME);
      }
      
      //TODO: Update with verifying OTP/Email address when auth
    } catch (error) {
      if (error instanceof PeerPrepErrors.NotFoundError) {
        toast.error("User not found. Please sign up instead.", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          theme: "dark"
        })
      } else {
        console.log(error);
        toast.error("Something went wrong. Please refresh and try again.", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          theme: "dark"
        })
      }
    } finally {
      // Cleanup
      setIsSubmitted(false);
    }

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
              <Spacer y={2} />
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
                  // onClick={() => {
                  //   setIsSubmitted(true);
                  // }}
                  // href="/verify"
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

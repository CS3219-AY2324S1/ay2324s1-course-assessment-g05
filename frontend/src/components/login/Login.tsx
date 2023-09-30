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
  Image,
} from "@nextui-org/react";
import PeerPrepLogo from "@/components/common/PeerPrepLogo";
import { UserService } from "@/helpers/user/user_api_wrappers";
import { CLIENT_ROUTES } from "@/common/constants";
import { useRouter, useParams } from "next/navigation";
import { PeerPrepErrors } from "@/types/PeerPrepErrors";
import User from "@/types/user";
import { Role } from "@/types/enums";
import displayToast from "@/components/common/Toast";
import { ToastType } from "@/types/enums";
import bcrypt from "bcryptjs-react";
import { AuthService } from "@/helpers/auth/auth_api_wrappers";
import { useAuthContext } from "@/contexts/auth";

export function LoginComponent() {
  const { logIn } = useAuthContext();
  const router = useRouter();

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

  // Validation

  useEffect(() => {
    setArePasswordsEqual(
      !(password !== checkPassword && password !== "" && checkPassword !== "")
    );

    if (password !== "" && checkPassword !== "" && password.length < 8) {
      setErrorMsg("Password should contain 8 characters or more.");
    } else if (!arePasswordsEqual) {
      setErrorMsg("Passwords do not match. Please try again.");
    } else if (name !== "" && name.length < 2) {
      setErrorMsg("Name has to contain at least 2 characters");
    } else {
      setErrorMsg("");
    }
  }, [
    name,
    password,
    checkPassword,
    setPassword,
    setCheckPassword,
    arePasswordsEqual,
  ]);

  async function submitNewUser(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (errorMsg !== "") {
      displayToast("Sign up failed. Please address the errors before submitting.", ToastType.ERROR);
      return;
    }

    setIsSubmitted(true);

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    let user: User = {
      name: name,
      email: email,
      password: hashedPassword,
      role: Role.USER,
    };

    try {
      let res = await AuthService.registerByEmail(user);
      await logIn(email, password);
      displayToast("Sign up success!", ToastType.SUCCESS);
      router.push(CLIENT_ROUTES.HOME); //TODO: Update with verifying OTP/Email address when auth
      sessionStorage.setItem("email", email.toString());
    } catch (error) {
      if (error instanceof PeerPrepErrors.ConflictError) {
        displayToast(
          "User already exists. Please login instead.",
          ToastType.ERROR
        );
      } else {
        displayToast(
          "Something went wrong. Please refresh and try again.",
          ToastType.ERROR
        );
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
      await logIn(email, password);
      displayToast("Login success!", ToastType.SUCCESS);
      router.push(CLIENT_ROUTES.HOME);
    } catch (error) {
      if (error instanceof PeerPrepErrors.NotFoundError) {
        displayToast(
          "User not found, please sign up instead.",
          ToastType.ERROR
        );
      } else if (error instanceof PeerPrepErrors.UnauthorisedError) {
        displayToast("Incorrect password. Please try again.", ToastType.ERROR);
      } else {
        displayToast(
          "Something went wrong. Please refresh and try again.",
          ToastType.ERROR
        );
      }
    } finally {
      // Cleanup
      setIsSubmitted(false);
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="items-center justify-center w-96 mx-auto pt-10 pb-10">
        <form className="w-1/2" onSubmit={isSignUp ? submitNewUser : getUser}>
          <PeerPrepLogo />
          <CardHeader className="lg font-bold justify-center">
            PeerPrep
          </CardHeader>
          <Spacer y={3} />
          <Input
            type="email"
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
                {isPasswordVisible ? (
                  <Image src="/assets/eye-hide.svg" />
                ) : (
                  <Image src="/assets/eye-show.svg" />
                )}
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
                    {isCheckPasswordVisible ? (
                      <Image src="/assets/eye-hide.svg" />
                    ) : (
                      <Image src="/assets/eye-show.svg" />
                    )}
                  </Button>
                }
              />
              <Spacer y={1} />
              <Input
                isClearable
                isRequired
                fullWidth
                minLength={2}
                onInput={(e) => {
                  setName(e.currentTarget.value);
                }}
                placeholder="Name"
              />
              <Spacer y={2} />
              <div className="text-red-500 text-center text-xs font-bold">
                {errorMsg}
              </div>
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
                    <Image src="/assets/submit_button.svg" />
                  ) : null}
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
                    <Image src="/assets/github.svg" />
                  </Button>
                  <Button className="p-2" isIconOnly variant="faded">
                    <Image src="/assets/google.svg" />
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

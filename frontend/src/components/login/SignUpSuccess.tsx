import { CLIENT_ROUTES } from "@/common/constants";
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Spacer,
  Button,
  Link,
} from "@nextui-org/react";
import React from "react";
import PeerPrepLogo from "../common/PeerPrepLogo";

interface ISignUpSuccessProps {
  email: string;
  setIsSignUpSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

const handleSendEmail = () => {
  //TODO: implement resend email endpoint in auth
};

const SignUpSuccess = ({ email, setIsSignUpSuccess }: ISignUpSuccessProps) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="items-center justify-center w-96 mx-auto pt-10 pb-10">
        <div className="w-1/2">
          <PeerPrepLogo />
          <CardHeader className="justify-center font-bold">
            Sign Up Success
          </CardHeader>
          <CardBody className="flex flex-col text-center ">
            <Divider />
            <Spacer y={5} />
            <p className="flex text-center">An email has been sent to:</p>
            <Spacer y={3} />
            <p className="flex text-yellow"> {email} </p>
            <Spacer y={3} />
            Please verify your email to access our services.
            <Spacer y={5} />
            <Button
              className="bg-sky-600"
              onClick={() => {
                setIsSignUpSuccess(false);
              }}
            >
              Back to login
            </Button>
            <Spacer y={5} />
            <Link
              size="sm"
              className="hover:underline text-sky-600 cursor-pointer"
              onClick={() => {
                handleSendEmail;
              }}
            >
              Did not receive an email? Click here to resend.
            </Link>
          </CardBody>
        </div>
      </Card>
    </div>
  );
};

export default SignUpSuccess;

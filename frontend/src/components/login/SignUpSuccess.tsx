import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Spacer,
  Button,
  Link,
  Spinner,
} from "@nextui-org/react";
import React from "react";
import PeerPrepLogo from "../common/PeerPrepLogo";
import { AuthService } from "@/helpers/auth/auth_api_wrappers";
import { PeerPrepErrors } from "@/types/PeerPrepErrors";
import { ToastType } from "@/types/enums";
import displayToast from "../common/Toast";
import { getLogger } from "@/helpers/logger";

interface ISignUpSuccessProps {
  email: string;
  setIsSignUp: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSignUpSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  isResendingEmail: boolean;
  handleSendEmail: () => void;
}

const SignUpSuccess = ({
  email,
  setIsSignUp,
  setIsSignUpSuccess,
  isResendingEmail,
  handleSendEmail,
}: ISignUpSuccessProps) => {
  const logger = getLogger("sign_up_success");

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
            <p className="flex justify-center text-yellow"> {email} </p>
            <Spacer y={3} />
            Please verify your email to access our services.
            <Spacer y={5} />
            <Button
              className="bg-sky-600"
              onClick={() => {
                setIsSignUpSuccess(false);
                setIsSignUp(false);
              }}
            >
              Back to login
            </Button>
            <Spacer y={5} />
            <Link
              size="sm"
              className="hover:underline text-sky-600 cursor-pointer"
              onClick={handleSendEmail}
            >
              Did not receive an email? Click here to resend.
            </Link>
            <Spacer y={5} />
            {isResendingEmail && <Spinner size="sm" color="default" />}
          </CardBody>
        </div>
      </Card>
    </div>
  );
};

export default SignUpSuccess;

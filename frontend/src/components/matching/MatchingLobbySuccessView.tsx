import { ModalBody, Card, CardBody, CardFooter, Button, ModalFooter } from "@nextui-org/react";
import { FiCodepen, FiPlay, FiThumbsUp, FiX } from "react-icons/fi";
import ProfilePictureAvatar from "../common/ProfilePictureAvatar";
import React from "react";
import Partner from "@/types/partner";
import { useAuthContext } from "@/providers/auth";

export type MatchingSuccessState = {
  userReady: boolean,
  partner: Partner,
  partnerReady: boolean,
  partnerLeft: boolean,
}

export default function MatchingLobbySuccessView({
  state,
  notifyUserReady,
  notifyStartCollab,
  cancel,
  rematch,
}: {
  state: MatchingSuccessState,
  notifyUserReady: (ready: boolean) => void,
  notifyStartCollab: () => void,
  cancel: () => void,
  rematch?: () => void,
}) {
  const { user } = useAuthContext();

  React.useEffect(() => {
    if (state.userReady && state.partnerReady) {
      console.log("I am the last person to be ready, I should create room in collab");

      notifyStartCollab();
    }
  }, [state.userReady, state.partnerReady])

  return (
    <>
      <ModalBody className="flex flex-row gap-2 items-center justify-center">
        <Card className="flex-1 m-4">
          <CardBody className="items-center p-2">
            <ProfilePictureAvatar size="16" profileUrl="" />
            <p className="w-24 truncate text-center">{user.name}</p>
          </CardBody>
          <CardFooter className="justify-center p-2">
            <Button onPress={e => notifyUserReady(!state.userReady)} color={state.userReady ? "success" : "primary"} className="w-full" startContent={
              state.userReady ? <FiThumbsUp /> : <FiPlay />
            } isDisabled={state.userReady || state.partnerLeft}>
              {state.userReady ? "Ready" : "Start"}
            </Button>
          </CardFooter>
        </Card>
        <div className="text-center">
          <p>Matched!</p>
          <FiCodepen className="m-4 w-12 h-12" />
        </div>
        <Card className="flex-1 m-4">
          <CardBody className="items-center p-2">
            <ProfilePictureAvatar size="16" profileUrl="" />
            <p className="w-24 truncate text-center">{state.partner.id}</p>
          </CardBody>
          <CardFooter className="justify-center p-2">
            {!state.partnerLeft &&
              <Button color={state.partnerReady ? "success" : "warning"} className="w-full" isLoading={!state.partnerReady} isDisabled startContent={
                state.partnerReady ? <FiThumbsUp /> : <></>
              }>
                {state.partnerReady ? "Ready" : "Waiting"}
              </Button>
            }
            {state.partnerLeft &&
              <Button color="danger" className="w-full" isDisabled startContent={
                <FiX />
              }>
                Left
              </Button>
            }
          </CardFooter>
        </Card>
      </ModalBody>
      <ModalFooter>
        <Button onPress={cancel}>Cancel</Button>
        {state.partnerLeft && <Button onPress={rematch} color="primary">Rematch</Button>}
      </ModalFooter>
    </>
  )
}
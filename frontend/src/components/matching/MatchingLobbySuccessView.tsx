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
  owner: boolean,
}

export default function MatchingLobbySuccessView({
  state,
  onUserReady,
  onStart,
  onCancel,
  onRematch,
}: {
  state: MatchingSuccessState,
  onUserReady: (ready: boolean) => void,
  onStart: () => void,
  onCancel: () => void,
  onRematch?: () => void,
}) {
  const { user } = useAuthContext();

  return (
    <>
      <ModalBody className="flex flex-row gap-2 items-center justify-center mt-10">
        <Card className="flex-1">
          <CardBody className="items-center p-2">
            <ProfilePictureAvatar size="16" profileUrl={user.image!} />
            <p className="w-24 truncate text-center">{user.name}</p>
          </CardBody>
          <CardFooter className="justify-center p-2">
            <Button onPress={e => onUserReady(!state.userReady)} color={state.userReady ? "success" : "primary"} className="w-full" startContent={
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
        <Card className="flex-1">
          <CardBody className="items-center p-2">
            <ProfilePictureAvatar size="16" profileUrl={state.partner.image!} />
            <p className="w-24 truncate text-center">{state.partner.name}</p>
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
        <Button onPress={onCancel}>Cancel</Button>
        {state.partnerLeft && 
          <Button onPress={onRematch} color="primary">Rematch</Button>
        }
        {state.owner && state.userReady && state.partnerReady && !state.partnerLeft && 
          <Button onPress={onStart} color="primary">Start</Button>
        }
      </ModalFooter>
    </>
  )
}
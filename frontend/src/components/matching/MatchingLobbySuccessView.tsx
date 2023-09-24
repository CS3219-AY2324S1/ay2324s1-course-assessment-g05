import { ModalBody, Card, CardBody, CardFooter, Button, ModalFooter } from "@nextui-org/react";
import { FiCodepen, FiPlay, FiThumbsUp, FiX } from "react-icons/fi";
import ProfilePictureAvatar from "../common/ProfilePictureAvatar";
import React from "react";

export default function MatchingLobbySuccessView({
  peer,
  cancel,
  rematch,
}: {
  peer: any, // Change to User,
  cancel: () => void,    // Anyone left the lobby
  rematch?: () => void, // User request to rematch
}) {
  const [userReady, setUserReady] = React.useState(false);
  const [peerReady, setPeerReady] = React.useState(false);
  const [peerLeft, setPeerLeft] = React.useState(false);

  const toggleUserReady = async () => {
    setUserReady(!userReady);
    if (userReady) {
      // Inform backend user is ready to start
      // Backend return with status:
      //  - wait for peer
      //  - start collab session
      //  - peer exit
      console.log("I'm ready");
    } else {
      // Inform backend user not ready
      console.log("I'm not ready")
    }
  }

  const debugLeave = async () => {
    setPeerLeft(!peerLeft)
  }

  const cancelMatch = () => {
    // Inform backend user wishes to terminate the match
    console.log("I quit");
    setUserReady(false);
    cancel();
  }

  const debug = () => {
    setPeerReady(!peerReady);
  }

  React.useEffect(() => {
    if (userReady && peerReady && !peerLeft) {
      console.log("We are ready to start!");

      // Redirect to collab service
    }

    // websock to backend: listen to peer status
    // readyStateChange -> update peer ready status
    // peerLeft -> set peerLeft
  }, [userReady, peerReady])

  return (
    <>
      <ModalBody className="flex flex-row gap-2 items-center justify-center">
        <Card className="flex-1 m-4">
          <CardBody className="items-center p-2">
            <ProfilePictureAvatar size="16" />
            <p className="w-24 truncate text-center">Me</p>
          </CardBody>
          <CardFooter className="justify-center p-2">
            <Button onPress={toggleUserReady} color={userReady ? "success" : "primary"} className="w-full" startContent={
                userReady ? <FiThumbsUp/> : <FiPlay/>
              }>
              {userReady ? "Ready" : "Start"}
            </Button>
          </CardFooter>
        </Card>
        <div className="text-center">
          <p>Matched!</p>
          <FiCodepen className="m-4 w-12 h-12" />
        </div>
        <Card className="flex-1 m-4">
          <CardBody className="items-center p-2">
            <ProfilePictureAvatar size="16" />
            <p className="w-24 truncate text-center">Peer</p>
          </CardBody>
          <CardFooter className="justify-center p-2">
            {!peerLeft &&
              <Button color={peerReady ? "success" : "warning"} className="w-full" isLoading={!peerReady} disabled startContent={
                peerReady ? <FiThumbsUp/> : <></>
              }>
                {peerReady ? "Ready" : "Waiting"}
              </Button>
            }
            {peerLeft &&
              <Button color="danger" className="w-full" disabled startContent={
                <FiX/>
              }>
                Left
              </Button>
            }
          </CardFooter>
        </Card>
      </ModalBody>
      <ModalFooter>
        <Button onPress={debug}>Debug: peerReady</Button>
        <Button onPress={debugLeave}>Debug: peerLeft</Button>
        {!peerLeft && <Button onPress={cancelMatch}>Cancel</Button>}
        {peerLeft && <Button onPress={rematch}>Rematch</Button>}
      </ModalFooter>
    </>
  )
}
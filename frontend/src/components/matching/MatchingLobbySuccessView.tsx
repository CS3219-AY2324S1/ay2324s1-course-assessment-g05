import { ModalBody, Card, CardBody, CardFooter, Button, ModalFooter, Tooltip, ModalHeader } from "@nextui-org/react";
import ProfilePictureAvatar from "../common/ProfilePictureAvatar";
import { useEffect, useState } from "react";
import Partner from "@/types/partner";
import { useAuthContext } from "@/providers/auth";
import { Icons } from "../common/Icons";
import SocketService from "@/helpers/matching/socket_service";
import Preference from "@/types/preference";
import ComplexityChip from "../question/ComplexityChip";

export type MatchingSuccessState = {
  userReady: boolean,
  partner: Partner,
  partnerReady: boolean,
  partnerLeft: boolean,
  owner: boolean,
}

export default function MatchingLobbySuccessView({
  isOwner,
  onStart,
  onCancel,
  onRematch,
}: {
  isOwner: boolean,
  onStart: () => void,
  onCancel: () => void,
  onRematch?: () => void,
}) {
  const { user } = useAuthContext();
  const [socketService, setSocketService] = useState<SocketService | null>(null);
  const [userReady, setUserReady] = useState(false);
  const [partnerReady, setPartnerReady] = useState(false);
  const [partnerLeft, setPartnerLeft] = useState(false);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [preference, setPreference] = useState<Preference | null>(null);

  const onUserReady = (ready: boolean) => {
    setUserReady(ready);
    socketService?.notifyUserReadyChange(ready);
  }

  useEffect(() => {
    async function initializeSocket() {
      await SocketService.getInstance().then(socket => {
        setSocketService(socket);

        setPreference(socket.getRoomPreference());
        setPartner(socket.getRoomPartner());
        socket.onRoomClosed(() => setPartnerLeft(true));
        socket.onPartnerReadyChange((ready) => setPartnerReady(ready));
      })

    }
    initializeSocket();
  }, [])

  return (
    <>
      <ModalHeader>
        <span>Matched</span>
      </ModalHeader>
      <ModalBody className="flex flex-col gap-4 items-center p-2">
        <div className="flex flex-row gap-2 items-center justify-center">
          <Card className="flex-1">
            <CardBody className="items-center p-2 ">
              <ProfilePictureAvatar size="16" profileUrl={user.image!} />
              <p className="w-24 truncate text-center">{user.name}</p>
            </CardBody>
            <CardFooter className="justify-center p-2">
              <Button onPress={e => onUserReady(!userReady)} color={userReady ? "success" : "primary"} className="w-full" startContent={
                userReady ? <Icons.FiThumbsUp /> : <Icons.FiPlay />
              } isDisabled={userReady || partnerLeft}>
                {userReady ? "Ready" : "Start"}
              </Button>
            </CardFooter>
          </Card>
          <div className="text-center">
            <Icons.FiCodepen className="m-4 w-12 h-12" />
          </div>
          <Card className="flex-1">
            <CardBody className="items-center p-2">
              <ProfilePictureAvatar size="16" profileUrl={partner?.image!} />
              <p className="w-24 truncate text-center">{partner?.name}</p>
            </CardBody>
            <CardFooter className="justify-center p-2">
              {!partnerLeft &&
                <Button color={partnerReady ? "success" : "warning"} className="w-full" isLoading={!partnerReady} isDisabled startContent={
                  partnerReady ? <Icons.FiThumbsUp /> : <></>
                }>
                  {partnerReady ? "Ready" : "Waiting"}
                </Button>
              }
              {partnerLeft &&
                <Button color="danger" className="w-full" isDisabled startContent={
                  <Icons.FiX />
                }>
                  Left
                </Button>
              }
            </CardFooter>
          </Card>
        </div>
        <div className="flex flex-col items-center gap-1 border-1 border-slate-600 rounded-md p-2 w-2/3">
          <div className="flex flex-row gap-2 text-sm">
            <span>Questions will be selected from:</span>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <div>
              <Tooltip className="capitalize" content={preference?.languages.join(", ").toLowerCase()}>
                <span className="capitalize text-ellipsis line-clamp-1">{preference?.languages.join(", ").toLowerCase()}</span>
              </Tooltip>
            </div>
            <div className=" flex flex-col items-center gap-1">
              {preference?.difficulties.map(item => (
                <ComplexityChip key={item} complexity={item}></ComplexityChip>
              ))}
            </div>
            <div>
              <Tooltip className="capitalize" content={preference?.topics.join(", ").toLowerCase()}>
                <span className="capitalize text-ellipsis line-clamp-1">{preference?.topics.join(", ").toLowerCase()}</span>
              </Tooltip>
            </div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        {(!userReady || !partnerReady) &&
          <Button onPress={onCancel} startContent={<Icons.FiX />}>Cancel</Button>
        }
        {partnerLeft &&
          <Button onPress={onRematch} color="warning" startContent={<Icons.RxReset />}>Rematch</Button>
        }
        {isOwner && userReady && partnerReady && !partnerLeft &&
          <Button onPress={onStart} color="primary" startContent={<Icons.FiPlay />}>Start Peerprep</Button>
        }
        {!isOwner && userReady && partnerReady && !partnerLeft &&
          <Button color="primary" isLoading>Waiting for {isOwner ? user.name : partner?.name} to start</Button>
        }
      </ModalFooter>
    </>
  );
}

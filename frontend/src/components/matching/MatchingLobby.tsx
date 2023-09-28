"use client"
import React from "react";
import {
  Modal,
  ModalContent, ModalBody,
  ModalFooter,
  Button, useDisclosure, CircularProgress, CardBody, CardFooter, Card
} from "@nextui-org/react";
import { FiUserX, FiWifiOff } from "react-icons/fi";
import ComplexityChip from "../question/ComplexityChip";
import MatchingLobbySuccessView from "./MatchingLobbySuccessView";

/**
 * Service flow:
 * Initial -> Matching -> Success -> Ready (both) -> redirect(collab)
 *                     -> Success -> Peer left -> Matching/exit
 *                     -> Fail  -> Matching
 *                     -> Error -> exit
 */
enum MATCHING_STAGE {
  INITIAL,
  MATCHING, // Send request to join queue, wait for update
  SUCCESS,  // Ready to start collab
  FAIL,     // Exceed time limit for matching
  READY,    // User confirm to start, waiting for peer (skip if peer already in ready stage)
  CANCEL,   // User request to cancel
  ERROR,    // Error with matching service
}

export default function MatchingLobby({
  isOpen,
  onClose,
  options = {
    languages: [],
    difficulties: [],
    topics: [],
  }
}: {
  isOpen: boolean,
  onClose: () => void,
  options: {
    languages: string[],
    difficulties: string[],
    topics: string[],
  }
}) {
  const [stage, setStage] = React.useState(MATCHING_STAGE.INITIAL);
  const { onOpenChange } = useDisclosure();

  const debugStage = () => {
    let opts = Object.keys(MATCHING_STAGE);
    let next = opts.findIndex(x => x === stage.toString()) + 1 % opts.length;
    setStage(next)
  }

  // Trigger matching process on modal open
  React.useEffect(() => {
    if (isOpen) {
      setStage(MATCHING_STAGE.MATCHING)
    } else {
      setStage(MATCHING_STAGE.INITIAL)
    }
  }, [isOpen])

  // Response to stage events
  React.useEffect(() => {
    switch (stage) {
      case MATCHING_STAGE.MATCHING:
        onMatchingStage();
        break;
      default:
        break;
    }
  }, [stage])

  // Handle view switching
  const renderView = (stage: MATCHING_STAGE) => {
    switch (stage) {
      case MATCHING_STAGE.MATCHING:
        return initialView;
      case MATCHING_STAGE.SUCCESS:
        return successView;
      case MATCHING_STAGE.FAIL:
        return failureView;
      default:
        return errorView;
    }
  }

  // Handles matching event
  const onMatchingStage = () => {
    try {
      console.log("matching process triggered");

      // Request to join matching queue
      setTimeout(() => {
        setStage(MATCHING_STAGE.SUCCESS)
      }, 60 * 1000)
    } catch (error) {
      setStage(MATCHING_STAGE.ERROR)
    }
  }

  // Handles retry action
  const handleRetry = () => {
    setStage(MATCHING_STAGE.MATCHING);
  }

  // Handles user ready action
  const handleReady = () => {
    console.log("User ready to start collab.");
    // Send update to backend indicating user ready to start.
    // Backend return with status:
    //  - wait for peer
    //  - start collab session
    //  - peer exit

    // redirect to collab session
    onClose();
  }

  const initialView = <>
    <ModalBody className="flex flex-col gap-2 p-4 h-full items-center justify-center">
      <CircularProgress
        classNames={{
          svg: "w-24 h-24",
          value: "text-lg"
        }}
        label="Looking for a peer...">
      </CircularProgress>
      <div className="flex flex-col gap-2 items-center text-small">
        {/* <span>{options.languages.join(", ")}</span> */}
        <span className="flex gap-2">
          {options.difficulties.map(item => (
            <ComplexityChip key={item} complexity={item} size="sm"></ComplexityChip>
          ))}
        </span>
        <span className="truncate">{options.topics.join(", ")}</span>
      </div>
    </ModalBody>
    <ModalFooter>
      <Button onPress={onClose}>Cancel</Button>
    </ModalFooter>
  </>

  const successView = <MatchingLobbySuccessView
    peer=""
    cancel={onClose}
    rematch={() => setStage(MATCHING_STAGE.MATCHING)} />

  const failureView = <>
    <ModalBody className="flex flex-col gap-2 p-4 h-full items-center justify-center">
      <FiUserX className="w-24 h-24  text-danger" />
      <p>Unable to find a match.</p>
      <p>Please try again later.</p>
    </ModalBody>
    <ModalFooter>
      <Button onPress={onClose}>Cancel</Button>
      <Button onPress={handleRetry} color="primary">Retry</Button>
    </ModalFooter>
  </>

  const errorView = <>
    <ModalBody className="flex flex-col gap-2 p-4 h-full items-center justify-center">
      <FiWifiOff className="w-24 h-24  text-danger" />
      <p>Connection lost!</p>
      <p>Please try again later.</p>
    </ModalBody>
    <ModalFooter>
      <Button onPress={onClose}>Ok</Button>
    </ModalFooter>
  </>

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        hideCloseButton
        size="md"
        classNames={{
          base: "h-1/2",
          body: "p-4",
          footer: "p-4"
        }}
      >
        <ModalContent>
          {() => (
            <>
              {renderView(stage)}
              <Button onPress={debugStage} className="absolute bottom-0" size="sm">debug</Button>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
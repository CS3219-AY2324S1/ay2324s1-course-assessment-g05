"use client"
import React from "react";
import {
  Modal,
  ModalContent, ModalBody,
  ModalFooter,
  Button, useDisclosure, CircularProgress, CardBody, CardFooter, Card
} from "@nextui-org/react";
import ProfilePictureAvatar from "../common/ProfilePictureAvatar";
import { FiCodepen, FiUserX, FiWifiOff, FiX } from "react-icons/fi";
import ComplexityChip from "../question/ComplexityChip";

/**
 * Service flow:
 * Initial -> Matching -> Success -> Ready (both) -> redirect(collab)
 *                     -> Fail  -> Matching
 *                     -> Error -> Initial
 */
enum MATCHING_STAGE {
  INITIAL,
  MATCHING, // Send request to join queue, wait for update
  SUCCESS, // Ready to start collab
  READY,  // User confirm to start, waiting for peer (skip if peer already in ready stage)
  FAIL,    // Exceed time limit for matching
  CANCEL,  // User request to cancel
  ERROR,   // Error with matching service
}

export default function MatchingLobby({
  options
} : {
  options:{}
}) {
  const [stage, setStage] = React.useState(MATCHING_STAGE.INITIAL);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

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

  // Handles initial stage
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

  const handleRetry = () => {
    setStage(MATCHING_STAGE.MATCHING);
  }

  const handleReady = () => {
    console.log("User ready to start collab.");
    // check if peer ready
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
      <div className="flex flex-col gap-2">
        <span>C++</span>
        <span><ComplexityChip complexity="Easy"></ComplexityChip></span>
        <span className="truncate">Array</span>
      </div>
    </ModalBody>
    <ModalFooter>
      <Button onPress={onClose}>Cancel</Button>
    </ModalFooter>
  </>

  const successView = <>
    <ModalBody className="flex flex-row gap-2 items-center justify-center">
      <Card>
        <CardBody className="items-center p-2">
          <ProfilePictureAvatar size="16" />
          <p className="w-24 truncate text-center">Username</p>
          {/* <div className="flex flex-col gap-2">
            <span>C++</span>
            <span><ComplexityChip complexity="Easy"></ComplexityChip></span>
            <span className="truncate">Array</span>
          </div> */}
        </CardBody>
        <CardFooter className="justify-center p-2">
          <Button onPress={handleReady} color="primary" className="w-full">Ready</Button>
        </CardFooter>
      </Card>
      <div className="text-center">
        <p>Matched</p>
        <FiCodepen className="m-4 w-12 h-12" />
      </div>
      <Card>
        <CardBody className="items-center p-2">
          <ProfilePictureAvatar size="16" />
          <p className="w-24 truncate text-center">Username</p>
          {/* <div className="flex flex-col gap-2">
            <span>C++</span>
            <span><ComplexityChip complexity="Easy"></ComplexityChip></span>
            <span className="truncate">Array</span>
          </div> */}
        </CardBody>
        <CardFooter className="justify-center p-2">
          <Button onPress={onClose} color="success" className="w-full" isLoading>Ready</Button>
        </CardFooter>
      </Card>
    </ModalBody>
    <ModalFooter>
      <Button onPress={onClose}>Cancel</Button>
    </ModalFooter>
  </>

  const failureView = <>
    <ModalBody className="flex flex-col gap-2 p-4 h-full items-center justify-center">
      <FiUserX className="w-24 h-24  text-danger" />
      <p>Unable to find a match.</p>
      {/* <div className="flex flex-col gap-2">
        <span>C++</span>
        <span><ComplexityChip complexity="Easy"></ComplexityChip></span>
        <span className="truncate">Array</span>
      </div> */}
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
      <Button onPress={onOpen}>Open</Button>
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
              <Button onPress={debugStage} className="absolute bottom-0">Debug</Button>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
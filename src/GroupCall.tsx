import { Box, Button, VStack } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useVideoCall } from "./context/videoCallContext";

const TestCall: React.FC = () => {
  const { connect, disconnect, participants, videoRef, videoContainerRef } =
    useVideoCall();

  const { roomId, username } = useParams();

  const handleConnect = () => {
    if (username && roomId) {
      connect(username, roomId);
    }
  };

  useEffect(() => {
    console.log({ participants });
  }, [participants]);
  return (
    <>
      <Button onClick={handleConnect}>Connect</Button>
      <Button onClick={disconnect}>Disconnect</Button>
      <Box
        w="20%"
        bg="transparent"
        border="2px"
        borderColor="white"
        position="absolute"
        bottom="50px"
        right="10px"
        rounded="md"
        overflow="hidden"
      >
        <video
          width="100%"
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ borderRadius: "4px" }}
        ></video>
      </Box>
      <Box w="full" bg="transparent" rounded="md" overflow="hidden">
        <VStack
          ref={videoContainerRef}
          id="videoContainer"
          flex={1}
          width="20%"
          p={4}
          spacing={4}
          bg="gray.50"
          align="stretch"
        ></VStack>
      </Box>
    </>
  );
};

export default TestCall;

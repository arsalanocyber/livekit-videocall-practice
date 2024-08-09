// src/pages/HomePage.tsx
import {
  Box,
  Button,
  Flex,
  IconButton,
  Stack,
  Tooltip,
} from "@chakra-ui/react";
import {
  BackgroundBlur,
  BackgroundTransformer,
  ProcessorWrapper,
} from "@livekit/track-processors";
import axios from "axios";
import { LocalVideoTrack, Room } from "livekit-client";
import { useEffect, useRef, useState } from "react";
import { MdLensBlur, MdOutlineBlurOff } from "react-icons/md";
import { PiDotsNineThin } from "react-icons/pi";
import { useNavigate, useParams } from "react-router-dom";
import { generateUniqueId } from "./utils/uniqueId";
import { PiSelectionBackground } from "react-icons/pi";

const GroupCallPrep = () => {
  const [token, setToken] = useState<string>("");
  const url = "ws://127.0.0.1:7880";
  const navigate = useNavigate();
  const { username } = useParams();
  const roomId = generateUniqueId();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeIcon, setActiveIcon] = useState<string>("blurOff");
  const [blurValue, setBlurValue] = useState<number>(0);
  const [isVirtualBG, setIsVirtualBG] = useState<boolean>(false);

  const imagePath =
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"; // Example path, replace with your actual path
  const name = "background-transformer";

  const handleJoinRoom = () => {
    if (roomId) {
      navigate(`/groupcall/${roomId}`);
    }
  };

  useEffect(() => {
    const handleConnect = async () => {
      const response = await axios.post(
        "http://localhost:3000/api/livekit/token",
        {
          identity: username,
          roomName: roomId,
        }
      );
      setToken(response.data.token);
      try {
        const newRoom = new Room({
          adaptiveStream: true,
          dynacast: true,
        });

        await newRoom.connect(url, response.data.token);
        console.log("connected to room", newRoom.name);

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        const localVideoTrack = new LocalVideoTrack(
          mediaStream.getVideoTracks()[0]
        );

        if (isVirtualBG) {
        }

        if (blurValue !== 0) {
          const blur = BackgroundBlur(blurValue);
          await localVideoTrack.setProcessor(blur);
        } else if (isVirtualBG) {
          console.log("here I come");
          const backgroundTransformer = new BackgroundTransformer({
            imagePath,
          });
          const pipeline = new ProcessorWrapper(backgroundTransformer, name);
          await localVideoTrack.setProcessor(pipeline);
        }

        if (videoRef.current) {
          localVideoTrack.attach(videoRef.current);
        }
      } catch (error) {
        console.error("Error in handleConnect:", error);
      }
    };

    handleConnect();
  }, [blurValue, isVirtualBG]);

  const handleIconClick = (icon: string) => {
    setActiveIcon(icon);
    if (icon === "fullBlur") {
      setIsVirtualBG(false);
      setBlurValue(10);
    } else if (icon === "lensBlur") {
      setIsVirtualBG(false);
      setBlurValue(3);
    } else if (icon === "virtualBackground") {
      setIsVirtualBG(true);
      setBlurValue(0);
    } else {
      setIsVirtualBG(false);
      setBlurValue(0);
    }
  };

  console.log(isVirtualBG);

  return (
    <Box p={4}>
      <Stack spacing={4} maxW="md" mx="auto">
        <Box
          w="100%"
          bg="transparent"
          border={"2px"}
          borderColor={"white"}
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

        {videoRef.current && (
          <Flex justifyContent={"center"}>
            <Tooltip label="No Blur" placement="top">
              <IconButton
                aria-label="No Blur"
                icon={<MdOutlineBlurOff />}
                onClick={() => handleIconClick("blurOff")}
                colorScheme={activeIcon === "blurOff" ? "teal" : "gray"}
                isRound
                mx={2}
                size="md"
              />
            </Tooltip>
            <Tooltip label="50% Blur" placement="top">
              <IconButton
                aria-label="half Blur Effect"
                icon={<PiDotsNineThin />}
                onClick={() => handleIconClick("lensBlur")}
                colorScheme={activeIcon === "lensBlur" ? "teal" : "gray"}
                isRound
                mx={2}
                size="md"
              />
            </Tooltip>
            <Tooltip label="Full Blur" placement="top">
              <IconButton
                aria-label="Blur Effect"
                icon={<MdLensBlur />}
                onClick={() => handleIconClick("fullBlur")}
                colorScheme={activeIcon === "fullBlur" ? "teal" : "gray"}
                isRound
                mx={2}
                size="md"
              />
            </Tooltip>
            <Tooltip label="Virtual Background" placement="top">
              <IconButton
                aria-label="Virtual Background"
                icon={<PiSelectionBackground />}
                onClick={() => handleIconClick("virtualBackground")}
                colorScheme={
                  activeIcon === "virtualBackground" ? "teal" : "gray"
                }
                isRound
                mx={2}
                size="md"
              />
            </Tooltip>
          </Flex>
        )}

        <Button colorScheme="teal" onClick={handleJoinRoom}>
          Create Group Call
        </Button>
      </Stack>
    </Box>
  );
};

export default GroupCallPrep;

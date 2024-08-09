import { Box, Flex, IconButton } from "@chakra-ui/react";
import axios from "axios";
import {
  LocalAudioTrack,
  LocalTrackPublication,
  LocalVideoTrack,
  RemoteTrack,
  Room,
  RoomEvent,
  Track,
  VideoPresets,
} from "livekit-client";
import React, { useEffect, useRef, useState } from "react";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
} from "react-icons/fa";

const TestCall: React.FC = () => {
  const [token, setToken] = useState<string>("");
  const url = "ws://127.0.0.1:7880";
  const [room, setRoom] = useState<Room | null>(null);
  const [localTracks, setLocalTracks] = useState<Map<string, Track>>(new Map());
  const [isMicrophoneMuted, setIsMicrophoneMuted] = useState<boolean>(false);
  const [isCameraOff, setIsCameraOff] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const queryParams = new URLSearchParams(location.search);
  const roomName = queryParams.get("roomName");
  const identity = queryParams.get("identity");

  console.log({ localTracks, token });
  useEffect(() => {
    const handleConnect = async () => {
      const response = await axios.post(
        "http://localhost:3000/api/livekit/token",
        {
          identity,
          roomName,
        }
      );
      setToken(response.data.token);
      try {
        const newRoom = new Room({
          adaptiveStream: true,
          dynacast: true,
          videoCaptureDefaults: {
            resolution: VideoPresets.h720.resolution,
          },
        });

        newRoom
          .on(RoomEvent.TrackSubscribed, handleTrackSubscribed)
          .on(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed)
          .on(RoomEvent.Disconnected, handleDisconnect)
          .on(RoomEvent.LocalTrackUnpublished, handleLocalTrackUnpublished);

        await newRoom.connect(url, response.data.token);
        console.log("connected to room", newRoom.name);

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        const localVideoTrack = new LocalVideoTrack(
          mediaStream.getVideoTracks()[0]
        );
        await newRoom.localParticipant.publishTrack(localVideoTrack);
        setLocalTracks((prev) => new Map(prev.set("video", localVideoTrack)));

        const localAudioTrack = new LocalAudioTrack(
          mediaStream.getAudioTracks()[0]
        );
        await newRoom.localParticipant.publishTrack(localAudioTrack);
        setLocalTracks((prev) => new Map(prev.set("audio", localAudioTrack)));

        setRoom(newRoom);

        if (videoRef.current) {
          localVideoTrack.attach(videoRef.current);
        }
      } catch (error) {
        console.error("Error in handleConnect:", error);
      }
    };

    handleConnect();
  }, [token, identity]);

  function handleTrackSubscribed(track: RemoteTrack) {
    if (track.kind === Track.Kind.Video || track.kind === Track.Kind.Audio) {
      if (remoteVideoRef.current) {
        track.attach(remoteVideoRef.current);
      }
    }
  }

  function handleTrackUnsubscribed(track: RemoteTrack) {
    track.detach();
  }

  function handleLocalTrackUnpublished(publication: LocalTrackPublication) {
    if (publication.track) {
      const trackId: string = publication.track.sid || "";
      setLocalTracks((prev) => {
        prev.delete(trackId);
        return new Map(prev);
      });
      publication.track.detach();
    }
  }

  function handleDisconnect() {
    console.log("disconnected from room");
    if (room) {
      room.localParticipant.trackPublications.forEach((publication) => {
        if (publication.track) {
          publication.track.stop();
          publication.track.detach();
        }
      });
      room.disconnect();
      setRoom(null);
      setLocalTracks(new Map());
    }
  }

  //============= Exta Functions =======================
  const handleToggleMicrophone = () => {
    if (!room) return;
    const localAudioTrack = localTracks.get("audio") as LocalAudioTrack;
    if (localAudioTrack) {
      if (isMicrophoneMuted) {
        localAudioTrack.unmute();
      } else {
        localAudioTrack.mute();
      }
      setIsMicrophoneMuted(!isMicrophoneMuted);
    }
  };

  const handleToggleCamera = () => {
    if (!room) return;
    const localVideoTrack = localTracks.get("video") as LocalVideoTrack;
    if (localVideoTrack) {
      if (isCameraOff) {
        localVideoTrack.unmute();
        localVideoTrack.attach(videoRef.current!);
      } else {
        localVideoTrack.detach();
        localVideoTrack.mute();
      }
      setIsCameraOff(!isCameraOff);
    }
  };
  //============= Exta Functions =======================

  return (
    <>
      <Box
        w="20%"
        bg="transparent"
        border={"2px"}
        borderColor={"white"}
        position={"absolute"}
        bottom={"50px"}
        right={"10px"}
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
        <video
          width="100%"
          ref={remoteVideoRef}
          autoPlay
          playsInline
          muted
          style={{ borderRadius: "8px" }}
        ></video>
        <Flex gap={2} mt={1} w="full" width={"full"} justifyContent={"center"}>
          <IconButton
            icon={isMicrophoneMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
            colorScheme="teal"
            aria-label={
              isMicrophoneMuted ? "Unmute Microphone" : "Mute Microphone"
            }
            onClick={handleToggleMicrophone}
          />
          <IconButton
            icon={isCameraOff ? <FaVideoSlash /> : <FaVideo />}
            colorScheme="teal"
            aria-label={isCameraOff ? "Turn On Camera" : "Turn Off Camera"}
            onClick={handleToggleCamera}
          />
        </Flex>
      </Box>
    </>
  );
};

export default TestCall;

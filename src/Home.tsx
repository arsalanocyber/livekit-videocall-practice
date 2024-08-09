// src/pages/HomePage.tsx
import { Box, Button, Input, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [roomName, setRoomName] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleJoinRoom = () => {
    if (roomName && username) {
      navigate(
        `/room?roomName=${encodeURIComponent(
          roomName
        )}&identity=${encodeURIComponent(username)}`
      );
    }
  };

  return (
    <Box p={4}>
      <Stack spacing={4} maxW="md" mx="auto">
        <Text fontSize="lg" mb={2}>
          Enter Room Name and Username
        </Text>
        <Input
          placeholder="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Button colorScheme="teal" onClick={handleJoinRoom}>
          Join Room
        </Button>
      </Stack>
    </Box>
  );
};

export default HomePage;

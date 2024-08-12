import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { VideoCallProvider } from "./context/videoCallContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <VideoCallProvider>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </VideoCallProvider>
  </StrictMode>
);

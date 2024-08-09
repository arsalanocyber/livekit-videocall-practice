// src/App.tsx
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./Home";
import RoomPage from "./RoomPage";
import Test from "./Test";
import GroupCall from "./GroupCall";
import GroupCallPrep from "./GroupCallPrep";

const App = () => {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/room" element={<RoomPage />} />
          <Route path="/groupcall-prep/:username" element={<GroupCallPrep />} />
          <Route path="/groupcall/:roomId" element={<GroupCall />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
};

export default App;

import { Room } from "livekit-client";

const wsURL = "ws://localhost:7880";
const token =
  "eyJhbGciOiJIUzI1NiJ9.eyJ2aWRlbyI6eyJyb29tSm9pbiI6dHJ1ZSwicm9vbSI6InVzZXIxIn0sImlzcyI6ImRldmtleSIsImV4cCI6MTcyMzEyMTkzMSwibmJmIjowLCJzdWIiOiJuZXdSb29tIn0.73roYx2ut_brwAitk1Vrh5qVU3W8Jr9ts7cVacZye3U";
const room = new Room();
await room.connect(wsURL, token);
console.log("connected to room", room.name);

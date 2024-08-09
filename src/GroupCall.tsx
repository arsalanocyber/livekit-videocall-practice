import React from "react";
import { useParams } from "react-router-dom";

const GroupCall = () => {
  const { roomId } = useParams();

  console.log({ roomId });
  return <div>GroupCall</div>;
};

export default GroupCall;

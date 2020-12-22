import { useActor } from "@xstate/react";
import React from "react";
import { FieldActor } from "./fieldMachine";

interface FieldProps {
  service: FieldActor;
}

export const Field: React.FC<FieldProps> = ({ service }) => {
  const [state, send] = useActor(service);

  return <div></div>;
};

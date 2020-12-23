import { useActor } from "@xstate/react";
import React from "react";
import { FieldActor } from "./fieldMachine";
import { TextInput } from "./inputs";

const components = {
  TextInput: TextInput,
};

interface FieldProps {
  service: FieldActor;
}

export const Field: React.FC<FieldProps> = ({ service }) => {
  const [state, send] = useActor(service);

  const { field, value } = state.context;

  return (
    <React.Fragment>
      {field.type === "text" ? (
        <components.TextInput
          {...field}
          id={field.name}
          value={value}
          onChange={(e) => {
            send({ type: "CHANGE", data: { value: e.target.value } });
          }}
          onFocus={(event) => {
            send({ type: "FOCUS" });
          }}
          onBlur={(event) => {
            send({ type: "BLUR" });
          }}
        />
      ) : null}
    </React.Fragment>
  );
};

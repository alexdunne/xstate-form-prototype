import { useActor } from "@xstate/react";
import React from "react";

import { FieldActor } from "./fieldMachine";
import { Components } from "./Form";

interface FieldProps {
  components: Components;
  service: FieldActor;
}

export const Field: React.FC<FieldProps> = ({ components, service }) => {
  const [state, send] = useActor(service);

  const { field, meta, label, helperText } = state.context;

  return (
    <components.FormControl labelFor={field.name} label={label} helperText={helperText} error={meta.error}>
      {field.type === "text" ? (
        <components.TextInput
          {...field}
          id={field.name}
          onChange={(value) => {
            send({ type: "CHANGE", data: { value } });
          }}
          onFocus={() => {
            send({ type: "FOCUS" });
          }}
          onBlur={() => {
            send({ type: "BLUR" });
          }}
        />
      ) : field.type === "textarea" ? (
        <components.Textarea
          {...field}
          id={field.name}
          onChange={(value) => {
            send({ type: "CHANGE", data: { value } });
          }}
          onFocus={() => {
            send({ type: "FOCUS" });
          }}
          onBlur={() => {
            send({ type: "BLUR" });
          }}
        />
      ) : field.type === "number" ? (
        <components.NumberInput
          {...field}
          id={field.name}
          onChange={(value) => {
            send({ type: "CHANGE", data: { value } });
          }}
          onFocus={() => {
            send({ type: "FOCUS" });
          }}
          onBlur={() => {
            send({ type: "BLUR" });
          }}
        />
      ) : null}
    </components.FormControl>
  );
};

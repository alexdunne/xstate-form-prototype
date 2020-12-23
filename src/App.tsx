import { inspect } from "@xstate/inspect";
import React from "react";

import { Form } from "./Form";

inspect({
  iframe: false,
});

const formConfig = {
  fields: [
    { name: "name", type: "text" as const, label: "Name", helperText: "Your name duh" },
    { name: "age", type: "text" as const, label: "Age", helperText: "age plz" },
    { name: "description", type: "textarea" as const, label: "Description", helperText: "who r u?" },
  ],
};

export default function App() {
  return <Form form={formConfig} />;
}

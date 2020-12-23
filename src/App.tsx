import { inspect } from "@xstate/inspect";
import React from "react";

import { Form } from "./Form";

inspect({
  iframe: false,
});

const formConfig = {
  fields: [
    { name: "name", type: "text" as const, label: "Name" },
    { name: "age", type: "number" as const, label: "Age" },
  ],
};

export default function App() {
  return <Form form={formConfig} />;
}

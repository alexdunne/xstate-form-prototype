import { inspect } from "@xstate/inspect";
import React from "react";

import { Form } from "./Form";

inspect({
  iframe: false,
});

const FORM_CONFIG = {
  fields: [
    { name: "firstName", type: "text" },
    { name: "surname", type: "text" },
    { name: "age", type: "number" },
  ],
};

export default function App() {
  return <Form form={FORM_CONFIG} />;
}

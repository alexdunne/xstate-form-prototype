import { inspect } from "@xstate/inspect";
import React, { useState } from "react";
import {
  ChakraProvider,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
  Stack,
} from "@chakra-ui/react";

import { Components, defaultComponents, Form } from "./Form";

inspect({
  iframe: false,
});

const formConfig = {
  fields: [
    { name: "name", type: "text" as const, label: "Name", helperText: "Your name duh" },
    { name: "age", type: "number" as const, label: "Age", helperText: "age plz" },
    { name: "description", type: "textarea" as const, label: "Description", helperText: "who r u?" },
  ],
};

const components: Components = {
  ...defaultComponents,
  Page: ({ children }) => {
    return (
      <Stack p="50px" spacing="24px">
        {children}
      </Stack>
    );
  },
  NumberInput: (props) => {
    return (
      <NumberInput
        {...props}
        onChange={(val) => {
          props.onChange(val);
        }}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    );
  },
  Textarea: (props) => {
    return (
      <Textarea
        {...props}
        onChange={(e) => {
          props.onChange(e.target.value);
        }}
      />
    );
  },
  TextInput: (props) => {
    return (
      <Input
        {...props}
        onChange={(e) => {
          props.onChange(e.target.value);
        }}
      />
    );
  },
};

const componentList = [defaultComponents, components];

export default function App() {
  const [isChakraActive, setChakraActive] = useState(false);

  const activeComponents = componentList[Number(isChakraActive)];

  // Gross but ezpz for testing
  // @ts-ignore
  window.toggleChakraActive = () => {
    setChakraActive((current) => !current);
  };

  return (
    <ChakraProvider resetCSS={isChakraActive}>
      <Form form={formConfig} components={activeComponents} />
    </ChakraProvider>
  );
}

import { useMachine } from "@xstate/react";
import React from "react";

import { Field } from "./Field";
import { formMachine, FormConfig } from "./formMachine";
import { FormControl, TextInput, Textarea, NumberInput } from "./inputs";

const Page: React.FC<any> = ({ children }) => children;

export const defaultComponents = {
  Page,
  FormControl,
  TextInput,
  Textarea,
  NumberInput,
};

export type Components = typeof defaultComponents;

interface FormProps {
  form: FormConfig;
  components?: Components;
}

export const Form: React.FC<FormProps> = ({ form, components = defaultComponents }) => {
  const [current] = useMachine(formMachine, {
    context: {
      config: {
        fields: form.fields,
      },
    },
    devTools: true,
  });

  const { fields } = current.context;

  return (
    <components.Page>
      {fields.map((field) => {
        return <Field key={field.id} service={field} components={components} />;
      })}
    </components.Page>
  );
};

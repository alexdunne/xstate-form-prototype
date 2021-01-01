import { useMachine } from "@xstate/react";
import React, { useCallback } from "react";

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
  enableDebugging?: boolean;
  onSubmit: (values: TSFixMe) => Promise<void>;
}

export const Form: React.FC<FormProps> = ({
  form,
  components = defaultComponents,
  enableDebugging = false,
  onSubmit,
}) => {
  const [current, send] = useMachine(formMachine, {
    context: {
      config: {
        fields: form.fields,
      },
      debug: enableDebugging,
    },
    services: {
      onSubmit: async (ctx) => {
        const values = ctx.fields.reduce((acc, field) => {
          const { name, value } = field.snapshot;

          acc[name] = value;

          return acc;
        }, {} as any);
        await onSubmit(values);
      },
    },
    devTools: enableDebugging,
  });

  const { fields } = current.context;

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      send({ type: "SUBMIT" });
    },
    [send]
  );

  console.log(current.value);

  return (
    <components.Page>
      <form onSubmit={handleSubmit}>
        {fields.map((field) => {
          return <Field key={field.ref.id} service={field.ref} components={components} />;
        })}

        <button type="submit">Submit</button>
      </form>
    </components.Page>
  );
};

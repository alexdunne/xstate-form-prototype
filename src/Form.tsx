import { useMachine } from "@xstate/react";
import React from "react";

import { Field } from "./Field";
import { formMachine, FormConfig } from "./formMachine";

interface FormProps {
  form: FormConfig;
}

export const Form: React.FC<FormProps> = (props) => {
  const [current] = useMachine(formMachine, {
    context: {
      config: {
        fields: props.form.fields,
      },
    },
    devTools: true,
  });

  const { fields } = current.context;

  return (
    <div>
      {fields.map((field) => {
        return <Field key={field.id} service={field} />;
      })}
    </div>
  );
};

import { assign, createMachine, spawn } from "xstate";

import { createFieldMachine, FieldActor } from "./fieldMachine";

interface FieldConfig {
  name: string;
  type: string;
}

export interface FormConfig {
  fields: FieldConfig[];
}

interface FormMachineContext {
  config: {
    fields: FieldConfig[];
  };
  fields: FieldActor[];
}

type FormMachineEvent = {
  type: "INITIALISE";
  data: {
    fields: FieldConfig[];
  };
};

type FormMachineState = any;

export const formMachine = createMachine<FormMachineContext, FormMachineEvent, FormMachineState>(
  {
    id: "form",
    context: {
      config: { fields: [] },
      fields: [],
    },
    initial: "initialising",
    states: {
      initialising: {
        always: [
          {
            actions: "initialiseFields",
            target: "ready",
          },
        ],
      },
      ready: {},
    },
  },
  {
    actions: {
      initialiseFields: assign({
        fields: (ctx) => {
          return ctx.config.fields.map((field) => {
            const { name } = field;

            return spawn(createFieldMachine({ fieldName: name }), name);
          });
        },
      }),
    },
  }
);

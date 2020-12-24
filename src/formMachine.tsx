import { assign, createMachine, spawn } from "xstate";

import { createFieldMachine, FieldActor, FieldMachineConfig } from "./fieldMachine";

export interface FormConfig {
  fields: FieldMachineConfig[];
}

interface FormMachineContext {
  config: FormConfig;
  fields: FieldActor[];
}

type FormMachineEvent = TSFixMe;

type FormMachineState = TSFixMe;

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
            return spawn(createFieldMachine(field), field.name);
          });
        },
      }),
    },
  }
);

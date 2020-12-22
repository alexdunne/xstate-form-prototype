import { ActorRefFrom, createMachine, assign } from "xstate";

import { assertEventType } from "./machine-utils";

type FieldValue = TSFixMe;

interface FieldMachineContext {
  name: string;
  value: FieldValue;
  touched: boolean;
  error?: string;
}

export type FieldMachineEvent =
  | {
      type: "CHANGE";
      data: {
        value: FieldValue;
      };
    }
  | {
      type: "FOCUS";
    }
  | {
      type: "BLUR";
    };

type FieldMachineState = any;

export type FieldActor = ActorRefFrom<ReturnType<typeof createFieldMachine>>;

interface CreateFieldMachineOptions {
  fieldName: string;
}

export const createFieldMachine = ({ fieldName }: CreateFieldMachineOptions) => {
  return createMachine<FieldMachineContext, FieldMachineEvent, FieldMachineState>(
    {
      id: fieldName,
      context: {
        name: fieldName,
        value: "",
        touched: false,
        error: undefined,
      },
      initial: "editing",
      states: {
        editing: {
          initial: "idle",
          states: {
            idle: {},
            invalid: {},
            validating: {
              always: [
                {
                  cond: { type: "isValid" },
                  target: "idle",
                  actions: ["changeValue", "clearError"],
                },
                {
                  target: "invalid",
                  actions: ["changeValue", "setErrorMessage"],
                },
              ],
            },
          },
          on: {
            CHANGE: {
              target: ".validating",
            },
            BLUR: {
              target: ".idle",
              actions: "markAsTouched",
            },
          },
        },
      },
    },
    {
      actions: {
        changeValue: assign({
          value: (ctx, ev) => {
            assertEventType(ev, "CHANGE");

            return ev.data.value;
          },
        }),
        markAsTouched: assign({
          touched: (ctx, ev) => {
            assertEventType(ev, "BLUR");

            return true;
          },
        }),
        clearError: assign({
          error: (ctx, ev) => {
            return undefined;
          },
        }),
        setError: assign({
          error: (ctx, ev) => {
            return "";
          },
        }),
      },
      guards: {
        isValid: (ctx, ev) => {
          if (ctx.touched) {
            return true;
          }

          // TODO - do validation

          return true;
        },
      },
    }
  );
};

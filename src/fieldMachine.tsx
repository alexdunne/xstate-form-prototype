import { ActorRefFrom, createMachine, assign, Interpreter } from "xstate";

import { assertEventType } from "./machine-utils";

type FieldType = "text" | "textarea" | "number";

export interface FieldConfig {
  name: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  helperText?: string;
}

type FieldValue = TSFixMe;

interface FieldMachineContext {
  field: FieldConfig;
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

type FieldMachineState = TSFixMe;

export type FieldService = Interpreter<FieldMachineContext, any, FieldMachineEvent>["machine"];

export type FieldActor = ActorRefFrom<FieldService>;

export const createFieldMachine = (config: FieldConfig) => {
  return createMachine<FieldMachineContext, FieldMachineEvent, FieldMachineState>(
    {
      id: config.name,
      context: {
        field: config,
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
                  actions: ["resetError"],
                },
                {
                  target: "invalid",
                  actions: ["setValidationError"],
                },
              ],
            },
          },
          on: {
            CHANGE: {
              target: ".validating",
              actions: ["cacheValue"],
            },
            FOCUS: {},
            BLUR: {
              target: ".validating",
              actions: "markAsTouched",
            },
          },
        },
      },
    },
    {
      actions: {
        cacheValue: assign({
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
        resetError: assign({
          error: (ctx, ev) => {
            return undefined;
          },
        }),
        setValidationError: assign({
          error: (ctx, ev) => {
            return "Field is invalid";
          },
        }),
      },
      guards: {
        isValid: (ctx, ev) => {
          if (!ctx.touched) {
            return true;
          }
          // TODO - do validation

          return ctx.value.length <= 4;

          // return true;
        },
      },
    }
  );
};

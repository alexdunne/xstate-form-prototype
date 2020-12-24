import { ActorRefFrom, createMachine, assign, Interpreter } from "xstate";

import { assertEventType } from "./machine-utils";

type FieldType = "text" | "textarea" | "number";

type FieldValue = TSFixMe;

export interface FieldMachineConfig {
  name: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  helperText?: string;
  defaultValue?: FieldValue;
}

export interface FieldConfig {
  name: string;
  type: FieldType;
  value: FieldValue;
  placeholder?: string;
}

export interface FieldMeta {
  touched: boolean;
  error?: string;
}

interface FieldMachineContext {
  field: FieldConfig;
  meta: FieldMeta;
  label: string;
  helperText?: string;
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

export const createFieldMachine = (config: FieldMachineConfig) => {
  return createMachine<FieldMachineContext, FieldMachineEvent, FieldMachineState>(
    {
      id: config.name,
      context: {
        field: {
          name: config.name,
          type: config.type,
          value: config.defaultValue ?? "",
          placeholder: config.placeholder,
        },
        meta: {
          touched: false,
          error: undefined,
        },
        label: config.label,
        helperText: config.helperText,
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
          field: (ctx, ev) => {
            assertEventType(ev, "CHANGE");

            return {
              ...ctx.field,
              value: ev.data.value,
            };
          },
        }),
        markAsTouched: assign({
          meta: (ctx, ev) => {
            assertEventType(ev, "BLUR");

            return {
              ...ctx.meta,
              touched: true,
            };
          },
        }),
        resetError: assign({
          meta: (ctx, ev) => {
            return {
              ...ctx.meta,
              error: undefined,
            };
          },
        }),
        setValidationError: assign({
          meta: (ctx, ev) => {
            return {
              ...ctx.meta,
              error: "Field is invalid",
            };
          },
        }),
      },
      guards: {
        isValid: (ctx, ev) => {
          if (!ctx.meta.touched) {
            return true;
          }
          // TODO - do validation

          return ctx.field.value.length <= 4;

          // return true;
        },
      },
    }
  );
};

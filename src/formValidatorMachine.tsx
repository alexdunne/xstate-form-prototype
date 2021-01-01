import { actions, ActorRefFrom, assign, createMachine, Interpreter } from "xstate";
import { sendParent } from "xstate/lib/actions";

import { FieldActor } from "./fieldMachine";
import { assertEventType } from "./machine-utils";

export interface FieldResponse {
  name: string;
  state: "pending" | "valid" | "invalid";
}

interface FormValidatorMachineContext {
  fields: {
    ref: FieldActor;
    response: FieldResponse;
  }[];
  mode: "partial" | "full";
}

type FormValidatorMachineEvent =
  | {
      type: "VALIDATE_FIELDS";
      data: {
        fields: FieldActor[];
      };
    }
  | {
      type: "SET_VALIDATION_MODE_FULL";
    }
  | {
      type: "SET_VALIDATION_MODE_PARTIAL";
    }
  | {
      type: "FIELD.UPDATE";
      data: FieldResponse;
    };

type FormValidatorMachineState = TSFixMe;

export type FormValidatorService = Interpreter<FormValidatorMachineContext, any, FormValidatorMachineEvent>["machine"];

export type FormValidatorActor = ActorRefFrom<FormValidatorService>;

export const createFormValidatorMachine = () => {
  return createMachine<FormValidatorMachineContext, FormValidatorMachineEvent, FormValidatorMachineState>(
    {
      id: "form-validator",
      context: {
        fields: [],
        mode: "partial",
      },
      initial: "idle",
      states: {
        idle: {
          id: "idle",
          on: {
            VALIDATE_FIELDS: {
              actions: "cacheFields",
              target: "in_progress",
            },
            SET_VALIDATION_MODE_FULL: {
              actions: "setModeFull",
            },
            SET_VALIDATION_MODE_PARTIAL: {
              actions: "setModePartial",
            },
          },
        },
        in_progress: {
          initial: "askingFieldsToValidate",
          states: {
            askingFieldsToValidate: {
              entry: ["validateFields"],
              always: {
                target: "waitingForResponses",
              },
            },
            waitingForResponses: {
              on: {
                "FIELD.UPDATE": {
                  actions: ["handleFieldResponse"],
                },
              },
              always: [
                { cond: "allFieldsValid", actions: ["informParentOfSuccess"], target: "#idle" },
                { cond: "anyFieldInvalid", actions: ["informParentOfFailure"], target: "#idle" },
              ],
            },
          },
        },
      },
    },
    {
      actions: {
        cacheFields: assign({
          fields: (ctx, ev) => {
            assertEventType(ev, "VALIDATE_FIELDS");

            return ev.data.fields.map((field) => {
              return {
                ref: field,
                response: {
                  name: field.id,
                  state: "pending",
                },
              };
            });
          },
        }),
        validateFields: actions.pure((ctx) => {
          return ctx.fields.map((field) => {
            const actionType = ctx.mode === "full" ? "FORM.VALIDATE" : "FORM.VALIDATE_SILENT";

            return actions.send(actionType, { to: field.ref as TSFixMe });
          });
        }),
        handleFieldResponse: assign({
          fields: (ctx, ev) => {
            assertEventType(ev, "FIELD.UPDATE");

            return ctx.fields.map((field) => {
              return field.response.name === ev.data.name ? { ...field, response: ev.data } : field;
            });
          },
        }),

        setModeFull: assign({
          mode: (ctx, ev) => "full",
        }),
        setModePartial: assign({
          mode: (ctx, ev) => "partial",
        }),

        informParentOfSuccess: sendParent((ctx, ev) => {
          return {
            type: "FORM_VALIDATOR.VALIDATION_SUCCESS",
          };
        }),
        informParentOfFailure: sendParent((ctx, ev) => {
          return {
            type: "FORM_VALIDATOR.VALIDATION_FAILURE",
            data: {
              invalidFields: ctx.fields
                .filter((field) => field.response.state === "invalid")
                .map((field) => field.response.name),
            },
          };
        }),
      },
      guards: {
        allFieldsValid: (ctx, ev) => {
          return ctx.fields.every((field) => field.response.state === "valid");
        },
        anyFieldInvalid: (ctx, ev) => {
          // If any fields are pending then wait
          const isPending = ctx.fields.some((field) => field.response.state === "pending");

          if (isPending) {
            return false;
          }

          // All fields have been validated, now check if any of them are invalid
          return ctx.fields.some((field) => field.response.state === "invalid");
        },
      },
      delays: {
        VALIDATION_TIMEOUT: 1000,
      },
    }
  );
};

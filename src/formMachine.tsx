import { assign, createMachine, spawn } from "xstate";

import { createFieldMachine, FieldActor, FieldMachineConfig } from "./fieldMachine";
import { assertEventType } from "./machine-utils";

export interface FormConfig {
  fields: FieldMachineConfig[];
}

interface FormMeta {
  validationMode: "partial" | "full";
}
interface FieldSnapshot {
  name: string;
  state: "pending" | "valid" | "invalid";
  value?: TSFixMe;
}

interface FormField {
  ref: FieldActor;
  // Holds a minimal representation of the field's state
  snapshot: FieldSnapshot;
}

interface FormMachineContext {
  config: FormConfig;
  meta: FormMeta;

  fields: FormField[];

  // Determines if we should output debug messages
  debug: boolean;
}

// Events sent from the field machine
type FieldEvent = {
  type: "FIELD.UPDATE";
  data: FieldSnapshot;
};

// Events sent from the form validator machine
type FormValidatorMachineEvent =
  | {
      type: "FORM_VALIDATOR.VALIDATION_SUCCESS";
    }
  | {
      type: "FORM_VALIDATOR.VALIDATION_FAILURE";
      data: {
        invalidFields: string[];
      };
    };

type FormMachineEvent = { type: "SUBMIT" } | FieldEvent | FormValidatorMachineEvent;

type FormMachineState = TSFixMe;

// const selectFormValidator = (ctx: FormMachineContext) => {
//   const { formValidator } = ctx;

//   if (!formValidator) {
//     throw new Error("Form validator is required, make sure to create on in the initialise step");
//   }

//   return formValidator;
// };

export const formMachine = createMachine<FormMachineContext, FormMachineEvent, FormMachineState>(
  {
    id: "form",
    context: {
      config: { fields: [] },
      fields: [],
      meta: {
        validationMode: "partial",
      },
      debug: false,
    },
    initial: "initialising",
    states: {
      initialising: {
        always: [
          {
            actions: "initialise",
            target: "ready",
          },
        ],
      },
      ready: {
        id: "ready",
        initial: "idle",
        states: {
          idle: {},
          invalid: {},
          submitting_form: {
            id: "submitting_form",
            entry: ["enableFullValidation"],
            initial: "validating",
            states: {
              validating: {
                initial: "askingFieldsToValidate",
                states: {
                  askingFieldsToValidate: {
                    entry: ["validateFields"],
                    always: {
                      target: "waitingForResponses",
                    },
                  },
                  waitingForResponses: {},
                },

                // entry: ["executeFormValidator"],
                // on: {
                //   "FORM_VALIDATOR.VALIDATION_SUCCESS": {
                //     target: "submitting",
                //   },
                //   "FORM_VALIDATOR.VALIDATION_FAILURE": {
                //     target: "#ready.invalid",
                //   },
                // },
              },
              submitting: {
                invoke: {
                  id: "submitting",
                  src: "onSubmit",
                  onDone: { target: "#ready.idle" },
                  onError: { target: "#ready.invalid" },
                },
              },
            },
            on: {
              // Ignore event
              SUBMIT: {},
            },
          },
        },
        on: {
          SUBMIT: {
            target: "ready.submitting_form",
          },
          "FIELD.UPDATE": [
            {
              cond: "isFormValid",
              actions: ["cacheFieldData"],
              target: "ready.idle",
            },
            {
              actions: ["cacheFieldData"],
              target: "ready.invalid",
            },
          ],
        },
      },
    },
  },
  {
    actions: {
      initialise: assign({
        fields: (ctx) => {
          return ctx.config.fields.map((field) => {
            return {
              ref: spawn(createFieldMachine(field), field.name),
              snapshot: {
                name: field.name,
                state: "pending",
              },
            };
          });
        },
      }),
      cacheFieldData: assign({
        fields: (ctx, ev) => {
          assertEventType(ev, "FIELD.UPDATE");

          return ctx.fields.map((field) => {
            if (field.snapshot.name !== ev.data.name) {
              return field;
            }

            return {
              ...field,
              snapshot: ev.data,
            };
          });
        },
      }),
      enableFullValidation: assign({
        meta: (ctx, ev) => {
          return { ...ctx.meta, validationMode: "full" };
        },
      }),
    },
    guards: {
      isFormValid: (ctx, ev) => {
        return ctx.fields.every((field) => {
          const validStates = ctx.meta.validationMode === "full" ? ["valid"] : ["pending", "valid"];

          return validStates.includes(field.snapshot.state);
        });
      },
    },
  }
);

/**
 * Derive the idle/invalid state on every FIELD.UPDATE. Control the validationMode (partial/full) in context
 *
 * How do we ask fields for their validation status when FIELD.UPDATE is all we have?
 *
 * Validate partial only has a list of w/e has been updated
 * Validate full asks all fields for their current state
 */

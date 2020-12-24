# xstate-form-prototype

This project is an experiment into using xstate to drive dynamic forms.

Part of the experiment is to see how much we can derive from a simple json object (possibly serializable).

## Inspiration

- [Formik](https://formik.org/)
- [Formium](https://formium.io/)
- [React Hook Form](https://react-hook-form.com/)
- [Chakra UI](https://chakra-ui.com/)

## Form machine

- [x] Actors of inputs
- [x] Hold form config
- [] Handle input changes
- [] Control field visibility
- [] Ask each field if it's valid

## Field machine

- [x] value
- [x] touched
- [x] error
- [] visible
- [x] changed events
- [x] blured events
- [] validation

## Field types

- [x] short answer (text input)
- [x] long answer (textarea)
- [x] number (standard via `type=number` and show replacing with [Chakra UI Number Input](https://chakra-ui.com/docs/form/number-input))
- [] boolean (default checkbox and show dropdown with Y/N)
- [] radio
- [] multiple short/long (min/max)

## Field settings

- [x] title/question
- [x] helper text
- [x] placeholder
- [] default value

## Points to consider

- [] field visibility
- [] section visibility
- [] page visibility
- [] required when another value is X (dependent fields)
- [] value middleware (e.g. update the value with a prefix/suffix)

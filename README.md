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

- [] short answer (text input)
- [] long answer (textarea)
- [] number
- [] boolean
- [] radio
- [] checkbox

## Field settings

- [] title/question
- [] helper text
- [] placeholder
- [] default value

## Points to consider

- [] field visibility
- [] section visibility
- [] page visibility
- [] required when another value is X
- [] value middleware (update the value with a prefix/suffix for example)

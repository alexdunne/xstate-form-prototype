import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
} from "@chakra-ui/react";
import React from "react";

interface TextInputProps {
  id: string;
  name: string;
  label: string;
  type: string;
  value: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onFocus: React.FocusEventHandler<HTMLInputElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
}

export const TextInput: React.FC<TextInputProps> = (props) => {
  return (
    <FormControl id={props.id} isInvalid={Boolean(props.error)}>
      <FormLabel>{props.label}</FormLabel>
      <Input
        id={props.id}
        name={props.name}
        type={props.type}
        placeholder={props.placeholder}
        onChange={props.onChange}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
      />
      {props.helperText ? (
        <FormHelperText>{props.helperText}</FormHelperText>
      ) : null}
      <FormErrorMessage>{props.error}</FormErrorMessage>
    </FormControl>
  );
};

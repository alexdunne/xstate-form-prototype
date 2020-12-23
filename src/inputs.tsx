import React from "react";

export interface FormControlProps {
  label: React.ReactNode;
  labelFor: string;
  helperText?: React.ReactNode;
  error?: React.ReactNode;
}

export const FormControl: React.FC<FormControlProps> = ({ label, labelFor, helperText, error, children }) => {
  return (
    <div>
      {label ? <label htmlFor={labelFor}>{label}</label> : null}
      {helperText ? <div>{helperText}</div> : null}
      {children}
      {error ? <div>{error}</div> : null}
    </div>
  );
};

export interface TextInputProps {
  id: string;
  name: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onFocus: React.FocusEventHandler<HTMLInputElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
}

export const TextInput: React.FC<TextInputProps> = (props) => {
  return (
    <input
      {...props}
      type="text"
      onChange={(e) => {
        props.onChange(e.target.value);
      }}
    />
  );
};

export interface TextareaProps {
  id: string;
  name: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onFocus: React.FocusEventHandler<HTMLTextAreaElement>;
  onBlur: React.FocusEventHandler<HTMLTextAreaElement>;
}

export const Textarea: React.FC<TextareaProps> = (props) => {
  return (
    <textarea
      {...props}
      rows={3}
      onChange={(e) => {
        props.onChange(e.target.value);
      }}
    />
  );
};

export interface NumberInputProps {
  id: string;
  name: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onFocus: React.FocusEventHandler<HTMLInputElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
}

export const NumberInput: React.FC<NumberInputProps> = (props) => {
  return (
    <input
      {...props}
      type="number"
      onChange={(e) => {
        props.onChange(e.target.value);
      }}
    />
  );
};

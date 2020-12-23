import React from "react";

interface FormControlProps {
  label: React.ReactNode;
  labelFor: string;
  helperText?: React.ReactNode;
  error?: React.ReactNode;
}

const FormControl: React.FC<FormControlProps> = ({ label, labelFor, helperText, error, children }) => {
  return (
    <div>
      {label ? <label htmlFor={labelFor}>{label}</label> : null}
      {helperText ? <div>{helperText}</div> : null}
      {children}
      {error ? <div>{error}</div> : null}
    </div>
  );
};

interface TextInputProps {
  id: string;
  name: string;
  type: string;
  value: string;
  placeholder?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onFocus: React.FocusEventHandler<HTMLInputElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
}

const TextInput: React.FC<TextInputProps> = (props) => {
  return <input {...props} />;
};

interface TextareaProps {
  id: string;
  name: string;
  value: string;
  placeholder?: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  onFocus: React.FocusEventHandler<HTMLTextAreaElement>;
  onBlur: React.FocusEventHandler<HTMLTextAreaElement>;
}

const Textarea: React.FC<TextareaProps> = (props) => {
  return <textarea {...props} rows={3} />;
};

export { FormControl, TextInput, Textarea };

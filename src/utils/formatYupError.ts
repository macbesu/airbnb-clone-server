import { ValidationError } from "yup";

export const formatYupError = (err: ValidationError) => {
  const errors: Array<{ path: String; message: String }> = [];
  err.inner.forEach(e => {
    errors.push({
      path: e.path,
      message: e.message,
    });
  });
  return errors;
};
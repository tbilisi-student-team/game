export type ValidationRules = {
  symbols: string;
  minLength: number;
  maxLength: number;
  pattern?: RegExp;
};

export type ValidationType =
  | 'text'
  | 'password'
  | 'login'
  | 'email'
  | 'name'
  | 'shortText'
  | 'phone'
  | 'equal'
  | 'file';

export type ValidationResult = {
  isValid: boolean;
  errorMessage: string | null;
};

export type ValidationFunction = {
  value: string;
  type: ValidationType;
};

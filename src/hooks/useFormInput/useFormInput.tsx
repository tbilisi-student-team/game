import { useCallback, useMemo, useState } from 'react';
import { checkFormInput, ValidationResult } from '../../components/utils/validation';
import { HookResult, HookInputObject, HookOutputObject, HookOutputFunction } from './types';

export const useFormInput = ({ type = 'text', value = '' }: HookInputObject): HookResult => {
  const [inputValue, setValue] = useState(value);
  const [validationType] = useState(type);
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    errorMessage: '',
    isValid: false,
  });

  const changeValue = useCallback(
    ({ value: newValue, equal }: HookInputObject) => {
      setValue(newValue!);
      const result = checkFormInput(newValue!, validationType, equal!);
      setValidationResult(result);
    },
    [validationType],
  );

  const resultObject = useMemo<HookOutputObject>(
    () => ({
      value: inputValue,
      errorMessage: validationResult.errorMessage,
      isValid: validationResult.isValid,
    }),
    [inputValue, validationResult],
  );

  return [resultObject, changeValue as HookOutputFunction];
};

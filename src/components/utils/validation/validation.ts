import { ValidationRules, ValidationType, ValidationResult } from './types';

const checkMaxLength = (length: number, maxLength: number) =>
  length > maxLength ? `Поле может быть не более ${maxLength} символов` : false;

const checkMinLength = (length: number, minLength: number) =>
  length < minLength ? `Поле должно быть длинее ${minLength} символов` : false;

const checkHasNumber = (value: string) => {
  const pattern = /(?=.*[0-9])/g;
  return !pattern.test(value) ? 'Поле должно содержать хотя бы 1 цифру' : false;
};

const checkHasSymbol = (value: string, symbols: string) => {
  const pattern = new RegExp(`(?=.*[${symbols}])`, 'g');
  return !pattern.test(value) ? `Поле должно содержать хотя бы 1 символ ${symbols}` : false;
};

const checkHasUppercase = (value: string) => {
  const pattern = /(?=.*[A-Z])/g;
  return !pattern.test(value) ? 'Поле должно содержать хотя бы 1 заглавную латинскую букву' : false;
};

const checkPattern = (
  value: string,
  pattern: RegExp,
  errorMessage = 'Поле заполнено некорректно',
) => (!pattern.test(value) ? errorMessage : false);

const checker = (checkResults: (string | boolean)[]): ValidationResult => {
  const res = checkResults.find((result) => result);

  return res != null
    ? ({
        isValid: false,
        errorMessage: res,
      } as ValidationResult)
    : ({
        isValid: true,
        errorMessage: null,
      } as ValidationResult);
};

export const checkPasswordValidaty = (value: string = ''): ValidationResult => {
  const rules: ValidationRules = {
    symbols: '!@#%&',
    minLength: 6,
    maxLength: 10,
  };
  rules.pattern = new RegExp(
    `^[0-9a-zA-Z${rules.symbols}]{${rules.minLength},${rules.maxLength}}$`,
    'g',
  );

  const checkList: (string | boolean)[] = [
    checkMaxLength(value.length, rules.maxLength),
    checkMinLength(value.length, rules.minLength),
    checkHasNumber(value),
    checkHasSymbol(value, rules.symbols),
    checkHasUppercase(value),
    checkPattern(
      value,
      rules.pattern,
      `Поле может содержать только буквы латинского алфавита, цифры и символы ${rules.symbols}`,
    ),
  ];

  return checker(checkList);
};

const checkLoginValidaty = (value: string = '') => {
  const rules: ValidationRules = {
    symbols: '!@_.',
    minLength: 4,
    maxLength: 255,
  };
  rules.pattern = new RegExp(
    `^[0-9a-zA-Z${rules.symbols}]{${rules.minLength},${rules.maxLength}}$`,
    'g',
  );

  const checkList: (string | boolean)[] = [
    checkPattern(
      value,
      rules.pattern,
      `Поле может содержать только буквы латинского алфавита, цифры и символы ${rules.symbols}`,
    ),
    checkMaxLength(value.length, rules.maxLength),
    checkMinLength(value.length, rules.minLength),
  ];

  return checker(checkList);
};

const checkEmailValidaty = (value: string = '') => {
  const rules: ValidationRules = {
    symbols: '',
    minLength: 5,
    maxLength: 25,
  };
  rules.pattern = /.+@.+\..+/i;

  const checkList: (string | boolean)[] = [
    checkPattern(value, rules.pattern, 'Ошибка в электронной почте'),
    checkMaxLength(value.length, rules.maxLength),
    checkMinLength(value.length, rules.minLength),
  ];

  return checker(checkList);
};

const checkEqualValidaty = (value: string = '', equal: string, errorMessage: string) => {
  const pattern = new RegExp(`^${equal}$`);
  const checkList: (string | boolean)[] = [checkPattern(value, pattern, errorMessage)];
  return checker(checkList);
};

const checkNameValidaty = (value: string = '') => {
  const rules: ValidationRules = {
    symbols: '',
    minLength: 2,
    maxLength: 25,
  };
  rules.pattern = /^[A-Zа-яё]{1,}$/gi;

  const checkList: (string | boolean)[] = [
    checkPattern(
      value,
      rules.pattern,
      'Поле может содержать только буквы латинского или русского алфавита',
    ),
    checkMaxLength(value.length, rules.maxLength),
    checkMinLength(value.length, rules.minLength),
  ];

  return checker(checkList);
};

const checkShortTextValidaty = (value: string = '') => {
  const rules: ValidationRules = {
    symbols: '',
    minLength: 2,
    maxLength: 100,
  };
  rules.pattern = /^[A-Zа-яё 0-9_-]{1,}$/gi;

  const checkList: (string | boolean)[] = [
    checkPattern(value, rules.pattern, 'Поле может содержать только буквы, цифры и знаки _-'),
    checkMaxLength(value.length, rules.maxLength),
    checkMinLength(value.length, rules.minLength),
  ];

  return checker(checkList);
};

const checkTextValidaty = (value: string = '') => {
  const rules: ValidationRules = {
    symbols: '',
    minLength: 1,
    maxLength: 500,
  };
  rules.pattern = /[^$]/gi;

  const checkList: (string | boolean)[] = [
    checkPattern(value, rules.pattern, 'Поле может содержать только буквы, цифры и знаки _-'),
    checkMaxLength(value.length, rules.maxLength),
    checkMinLength(value.length, rules.minLength),
  ];

  return checker(checkList);
};

const checkPhoneValidaty = (value: string = '') => {
  const rules: ValidationRules = {
    symbols: '',
    minLength: 10,
    maxLength: 50,
  };
  rules.pattern = /^[0-9-+\s()]{1,}$/gi;

  const checkList: (string | boolean)[] = [
    checkPattern(value, rules.pattern, 'Неверный номер телефона'),
    checkMaxLength(value.length, rules.maxLength),
    checkMinLength(value.length, rules.minLength),
  ];

  return checker(checkList);
};

export const checkFormInput = (value: string, type: ValidationType, equal: string) => {
  let result: ValidationResult = {
    isValid: false,
    errorMessage: null,
  };

  if (value && type) {
    switch (type) {
      case 'password':
        result = checkPasswordValidaty(value);
        break;
      case 'login':
        result = checkLoginValidaty(value);
        break;
      case 'email':
        result = checkEmailValidaty(value);
        break;
      case 'name':
        result = checkNameValidaty(value);
        break;
      case 'shortText':
        result = checkShortTextValidaty(value);
        break;
      case 'phone':
        result = checkPhoneValidaty(value);
        break;
      case 'equal':
        result = checkEqualValidaty(value, equal, 'Поля не равны');
        break;
      case 'text':
        result = checkTextValidaty(value);
        break;
      default:
        break;
    }
  }
  return result;
};

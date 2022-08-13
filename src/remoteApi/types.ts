export type SignInRequest = {
  login: string;
  password: string;
};

export type SignUpRequest = SignInRequest & {
  first_name: string;
  second_name: string;
  email: string;
  phone: string;
};

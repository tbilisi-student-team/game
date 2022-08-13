import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Header from '../../UI/Header';
import { InputField } from '../../UI/InputField';
import Button from '../../UI/Button';
import { Form } from '../../components/Form/Form';
import { RoutePaths } from '../../types'
import { formScheme, InputNames } from '../../UI/formScheme';

import buddy1 from '../../assets/buddy-1.png';
import buddy2 from '../../assets/buddy-2-otr.png';
import { authController } from '../../components/AuthController';
import { useFormInput } from '../../hooks/useFormInput';
export function SignIn () {
  const [requestError, setRequestError] = useState('');
  const navigate = useNavigate();
 
  const [
    { value: loginValue, isValid: loginIsValid, errorMessage: loginErrorMessage },
    setLoginValue,
  ] = useFormInput({ type: formScheme[InputNames.LOGIN].type });

  const [
    { value: passwordValue, isValid: passwordIsValid, errorMessage: passwordErrorMessage },
    setPasswordValue,
  ] = useFormInput({ type: formScheme[InputNames.PASSWORD].type });

  const formSubmitHandle = (formData: FormData) => {
    authController
      .signIn(formData)
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setRequestError(error.response.data.reason ?? '');
        }
      });
  };
  return (
    <div className='wrapper'>
      {<Header/>}
      <div className='main'>
        <div className='main-title'>
          Pew!
        </div>
        <div className='main-description'>
          Study project of Tbilisi Team
        </div>
      </div>
      <div className='signin__container'>
        <div className='left-character__signin'>
          <img src={buddy1} alt='Buddy One' />
        </div>
        <Form className='signin-form' onSubmitHandler={formSubmitHandle} >
       
        <InputField
            id={InputNames.LOGIN}
            name={formScheme[InputNames.LOGIN].name}
            label="Логин"
            isValid={loginIsValid}
            errorText={loginErrorMessage}
            value={loginValue}
            view="labeled"
            onChangeHandle={setLoginValue}
          />
          <InputField
            id={InputNames.PASSWORD}
            type="password"
            name={formScheme[InputNames.PASSWORD].name}
            label="Пароль"
            isValid={passwordIsValid}
            errorText={passwordErrorMessage}
            value={passwordValue}
            view="labeled"
            onChangeHandle={setPasswordValue}
          />
          <div>{requestError}</div>
            <Button title={'Sign in'} />
          

          <div className='signup-link'>
            <Link className='header-link' to={RoutePaths.SignUp}>{'I\'m new here'}</Link>
          </div>
          
        </Form>
       
        <div className='right-character__signin'>
          <img src={buddy2} alt='Buddy Two' />
        </div>
      </div>
    </div>
  )
}

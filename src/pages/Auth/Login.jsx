import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// import './Home.css';
import Header from '../../components/PageHeaders/Header';
import Loading from '../../components/Loading/Loading';

import { required } from '../../util/validators';

import { socketConnectAuth } from '../../util/sockets';
import Frame from '../../components/Form/Frame/Frame';
import Input from '../../components/Form/Input/Input';
import Button from '../../components/Form/Button/Button';

export default function Home(props) {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState({
    form: {
      Email: {
        value: '',
        valid: false,
        touched: false,
        validators: [required],
      },
      Password: {
        value: '',
        valid: false,
        touched: false,
        validators: [required],
      },
    },
    formIsValid: false,
  });

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      socketConnectAuth.open();
      setLoading(false);
    }
    return () => {
      socketConnectAuth.close();
      isMounted = false;
    };
  }, []);
  const inputChangeHandler = (input, value) => {
    setState((prevState) => {
      let isValid = true;
      for (const validator of prevState.form[input].validators) {
        isValid = isValid && validator(value);
      }
      const updatedForm = {
        ...prevState.form,
        [input]: {
          ...prevState.form[input],
          valid: isValid,
          value: value,
        },
      };
      let formIsValid = true;
      for (const inputName in updatedForm) {
        formIsValid = formIsValid && updatedForm[inputName].valid;
      }
      return {
        ...state,
        form: updatedForm,
        formIsValid: formIsValid,
      };
    });
  };

  const inputBlurHandler = (input) => {
    setState((prevState) => {
      return {
        ...state,
        form: {
          ...prevState.form,
          [input]: {
            ...prevState.form[input],
            touched: true,
          },
        },
      };
    });
  };

  useEffect(() => {});
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Frame>
          <Header header="Login" />
          <form
            onSubmit={(e) =>
              props.onLogin(
                e,
                {
                  Email: state.form.Email.value,
                  Password: state.form.Password.value,
                },
                socketConnectAuth
              )
            }
          >
            <Input
              label="Email"
              id="Email"
              type="text"
              value={state.form.Email.value}
              onChange={inputChangeHandler}
              onBlur={inputBlurHandler.bind(this, 'Email')}
            />
            <Input
              label="Password"
              id="Password"
              type="password"
              value={state.form.Password.value}
              onChange={inputChangeHandler}
              onBlur={inputBlurHandler.bind(this, 'Password')}
            />
            <div className="uk-flex uk-flex-between">
              <Button
                btnName="Login"
                type="submit"
                loading={props.authLoading}
                disabled={props.authLoading}
              />
              <Link
                to={{
                  pathname: '/signup',
                  state: {},
                }}
              >
                <span className="uk-text-small uk-text-lighter">Singup</span>{' '}
              </Link>
            </div>
          </form>
        </Frame>
      )}
    </>
  );
}

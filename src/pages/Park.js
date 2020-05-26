import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Uikit from 'uikit';

import Navbar from '../components/Navbar/Navbar';
import Frame from '../components/Form/Frame/Frame';
import Input from '../components/Form/Input/Input';
import Button from '../components/Form/Button/Button';

import { required, numeric } from '../util/validators';
import { socketConnectParques } from '../util/sockets';
import Loading from '../components/Loading/Loading';
import Header from '../components/PageHeaders/Header';

export default function Parks(props) {
  let history = useHistory();
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState({
    form: {
      Name: {
        value: '',
        valid: false,
        validators: [required],
      },
      Price: {
        value: '',
        valid: false,
        validators: [required, numeric],
      },
      NumOfSpaces: {
        value: '',
        valid: false,
        validators: [required, numeric],
      },
      NumOfHandicape: {
        value: '',
        valid: true,
        validators: [numeric],
      },
    },
    modal: {
      title: '',
      message: '',
    },
    formIsValid: false,
  });
  const [stateReset, setStateReset] = useState(state);
  const getInitialData = () => {
    socketConnectParques.emit('getAllParques');
    socketConnectParques
      .off('responseGetAllParque')
      .on('responseGetAllParque', (data) => {
        const allClientes = data.data;
        setState((prevState) => {
          return { ...prevState, allClientes };
        });
        setLoading(false);
      });
  };

  const handleSubmitResponse = () => {
    socketConnectParques
      .off('respCreateParque')
      .on('respCreateParque', (data) => {
        console.log('got it ', data);
        if (data.status === 201) {
          Uikit.modal.alert(`Park was created!`).then(function () {
            history.push('/');
          });
        } else {
          Uikit.modal.alert(`Park was not created!`).then(function () {
            history.push('/');
          });
        }
      });
  };

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

  const handleSubmit = () => {
    const obj = {
      nome: state.form.Name.value,
      precoPorHora: state.form.Price.value,
      numLugares: state.form.NumOfSpaces.value,
      numMobilidadeReduzida: state.form.NumOfHandicape.value,
    };
    socketConnectParques.emit('formSubmit', obj);
    console.log(state);
  };
  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      socketConnectParques.open();
      getInitialData();
      handleSubmitResponse();
    }
    return () => {
      socketConnectParques.close();
      isMounted = false;
    };
  }, []);
  return (
    <>
      <Navbar onLogout={props.onLogout} isAdmin={props.isAdmin}/>
      {loading ? (
        <Loading />
      ) : (
        <Frame>
          <Header header="Park Management" />
          <Input
            label="Park Name"
            id="Name"
            type="text"
            value={state.form.Name.value}
            valid={state.form.Name.valid}
            touched={state.form.Name.touched}
            onChange={inputChangeHandler}
            onBlur={inputBlurHandler.bind(this, 'Name')}
          />
          <Input
            label="Price by hour"
            id="Price"
            type="number"
            value={state.form.Price.value}
            valid={state.form.Price.valid}
            touched={state.form.Price.touched}
            onChange={inputChangeHandler}
            onBlur={inputBlurHandler.bind(this, 'Price')}
          />
          <Input
            label="Number of parking spaces"
            id="NumOfSpaces"
            type="number"
            value={state.form.NumOfSpaces.value}
            valid={state.form.NumOfSpaces.valid}
            touched={state.form.NumOfSpaces.touched}
            onChange={inputChangeHandler}
            onBlur={inputBlurHandler.bind(this, 'NumOfSpaces')}
          />
          <Input
            label="Number of handicape spaces (inclusive)"
            id="NumOfHandicape"
            type="number"
            value={state.form.NumOfHandicape.value}
            valid={state.form.NumOfHandicape.valid}
            touched={state.form.NumOfHandicape.touched}
            onChange={inputChangeHandler}
            onBlur={inputBlurHandler.bind(this, 'NumOfHandicape')}
          />
          <Button
            btnName="Send"
            onClick={handleSubmit}
            disabled={!state.formIsValid}
          />
        </Frame>
      )}
    </>
  );
}

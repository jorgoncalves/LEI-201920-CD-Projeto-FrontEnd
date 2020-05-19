import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Uikit from 'uikit';

import Navbar from '../components/Navbar/Navbar';
import Frame from '../components/Form/Frame/Frame';
import Input from '../components/Form/Input/Input';
import Button from '../components/Form/Button/Button';

import { required, numeric } from '../util/validators';
import { socketClientes } from '../util/socket-address';
import Modal from '../components/Modal/Modal';
import Loading from '../components/Loading/Loading';
import Header from '../components/PageHeaders/Header';

export default function Clients() {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState({
    form: {
      Name: {
        value: '',
        valid: false,
        validators: [required],
      },
      LicensePlate: {
        value: '',
        valid: false,
        validators: [required],
      },
      Charge: {
        value: '',
        valid: false,
        validators: [required, numeric],
      },
    },
    modal: {
      title: '',
      message: '',
    },
    formIsValid: false,
  });
  const [stateReset, setStateReset] = useState(state);
  const [socket, setSocket] = useState(io.connect(socketClientes));
  useEffect(() => {
    socket.on('connect', () => {
      socket.emit('getAllClients');
      socket.on('responseGetAll', (data) => {
        const allClientes = data.data;
        setState((prevState) => {
          return { ...prevState, allClientes };
        });
        setLoading(false);
      });
    });
  });

  socket.on('response', (data) => {
    console.log('got it ', data);
    if (data.status === 201) {
      setState({
        ...stateReset,
        modal: {
          title: 'Success!',
          message: 'Client was created!',
        },
      });
      // setState({ ...stateReset });
    } else {
      setState({
        ...state,
        modal: {
          title: 'Failure!',
          message: 'Client was not created!',
        },
      });
    }
    Uikit.modal('#modalSocketResponse').show();
    console.log(state);
  });

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
      // for (const inputName in updatedForm) {
      //   formIsValid = formIsValid && updatedForm[inputName].valid;
      // }
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
      matriculas: state.form.LicensePlate.value,
      carregamento: state.form.Charge.value,
    };
    socket.emit('formSubmit', obj);
    console.log(state);
  };
  return (
    <>
      <Modal title={state.modal.title} message={state.modal.message} />
      <Navbar />
      {loading ? (
        <Loading />
      ) : (
        <Frame>
          <Header header="Client Management" />
          <Input
            label="Name"
            id="Name"
            type="text"
            value={state.form.Name.value}
            // valid={state.form.Name.valid}
            // touched={state.form.Name.touched}
            onChange={inputChangeHandler}
            onBlur={inputBlurHandler.bind(this, 'Name')}
          />
          <Input
            label="License plate (use comma to separate multiple)"
            id="LicensePlate"
            type="text"
            value={state.form.LicensePlate.value}
            valid={state.form.LicensePlate.valid}
            touched={state.form.LicensePlate.touched}
            onChange={inputChangeHandler}
            onBlur={inputBlurHandler.bind(this, 'LicensePlate')}
          />
          <Input
            label="Charge"
            id="Charge"
            type="text"
            value={state.form.Charge.value}
            valid={state.form.Charge.valid}
            touched={state.form.Charge.touched}
            onChange={inputChangeHandler}
            onBlur={inputBlurHandler.bind(this, 'Charge')}
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

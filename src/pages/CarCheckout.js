import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Uikit from 'uikit';
import moment from 'moment';

import { required, numeric } from '../util/validators';
import { socketRegistos } from '../util/socket-address';

import Navbar from '../components/Navbar/Navbar';
import Loading from '../components/Loading/Loading';
import Frame from '../components/Form/Frame/Frame';
import Input from '../components/Form/Input/Input';
import Button from '../components/Form/Button/Button';
import Header from '../components/PageHeaders/Header';
import Modal from '../components/Modal/Modal';
import Select from '../components/Form/Select/Select';

export default function CarCheckout() {
  const [state, setState] = useState({
    form: {
      LicensePlate: {
        value: '',
        valid: false,
        validators: [required],
      },
      Park: {
        value: '',
        valid: false,
        validators: [required],
      },
      Place: {
        value: '',
        valid: false,
        validators: [required],
      },
      TotalPrice: {
        value: '',
        valid: false,
        validators: [required],
      },
      PaymentMethod: {
        value: '',
        valid: false,
        validators: [required],
      },
    },
    modal: {
      title: '',
      message: '',
    },
    formIsValid: false,
  });
  const [stateReset, setStateReset] = useState(state);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(io.connect(socketRegistos));

  useEffect(() => {
    socket.on('connect', () => {
      socket.emit('getAllRegistos');
      // Apenas registos em que saida == null
      socket.on('responseGetAllRegistos', (data) => {
        const allRegistos = data.data;
        setState((prevState) => {
          return { ...prevState, allRegistos };
        });
        setLoading(false);
      });
    });
  });

  const inputChangeHandler = (input, value) => {
    setState((prevState) => {
      let isValid = true;
      for (const validator of prevState.form[input].validators) {
        isValid = isValid && validator(value);
      }
      let updatedForm = {
        ...prevState.form,
        [input]: {
          ...prevState.form[input],
          valid: isValid,
          value: value,
        },
      };
      const findResult = prevState.allRegistos.find(
        (registo) => registo.matricula === value
      );
      console.log(findResult);

      if (findResult) {
        const hora_entrada = moment(findResult.hora_entrada);
        const hora_saida = moment();
        console.log(hora_entrada);
        console.log(hora_saida);

        console.log(moment.duration(hora_saida.diff(hora_entrada)).hours());

        const valor =
          moment.duration(hora_saida.diff(hora_entrada)).hours() === 0
            ? findResult.parque.precoPorHora
            : moment.duration(hora_saida.diff(hora_entrada)).hours() *
              findResult.parque.precoPorHora;

        console.log(valor);
        updatedForm.Park.value = findResult.parque.nome;
        updatedForm.Place.value = findResult.lugar.label;
        updatedForm.TotalPrice.value = valor;
      } else {
        updatedForm.Park.value = '';
        updatedForm.Place.value = '';
        updatedForm.TotalPrice.value = '';
      }
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
  socket.on('response', (data) => {
    console.log('got it ', data);
    if (data.status === 201) {
      setState({
        ...stateReset,
        modal: {
          title: 'Success!',
          message: 'Car has been checked out!',
        },
      });
      // setState({ ...stateReset });
    } else {
      setState({
        ...state,
        modal: {
          title: 'Failure!',
          message: `Car hasn't been checked out!`,
        },
      });
    }
    Uikit.modal('#modalSocketResponse').show();
    console.log(state);
  });
  const selectChangeHandler = (input, value) => {
    setState((prevState) => {
      let isValid = true;
      for (const validator of prevState.form[input].validators) {
        isValid = isValid && validator(value);
      }
      let updatedForm = {
        ...prevState.form,
        [input]: {
          ...prevState.form[input],
          valid: isValid,
          value: value,
        },
      };
      return {
        ...state,
        form: updatedForm,
      };
    });
    console.log(value);
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
      nome: state.form.LicensePlate.value,
    };
    // socket.emit('formSubmit', obj);
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
          <Header header="Car checkout" />
          <Input
            label="License Plate"
            id="LicensePlate"
            type="text"
            // data={}
            value={state.form.LicensePlate.value}
            valid={state.form.LicensePlate.valid}
            touched={state.form.LicensePlate.touched}
            onChange={inputChangeHandler}
            onBlur={inputBlurHandler.bind(this, 'LicensePlate')}
          />
          <Input
            label="Park"
            id="Park"
            type="text"
            disabled={true}
            value={state.form.Park.value}
            valid={state.form.Park.valid}
            touched={state.form.Park.touched}
            onChange={inputChangeHandler}
            onBlur={inputBlurHandler.bind(this, 'Park')}
          />
          <Input
            label="Place"
            id="Place"
            type="text"
            disabled={true}
            value={state.form.Place.value}
            valid={state.form.Place.valid}
            touched={state.form.Place.touched}
            onChange={inputChangeHandler}
            onBlur={inputBlurHandler.bind(this, 'Place')}
          />
          {/* <Input
            label="Payment method"
            id="PaymentMethod"
            type="text"
            value={state.form.PaymentMethod.value}
            valid={state.form.PaymentMethod.valid}
            touched={state.form.PaymentMethod.touched}
            onChange={inputChangeHandler}
            onBlur={inputBlurHandler.bind(this, 'PaymentMethod')}
          /> */}
          <Select
            label="Payment method"
            id="PaymentMethod"
            valid={state.form.PaymentMethod.valid}
            touched={state.form.PaymentMethod.touched}
            onChange={selectChangeHandler}
            onBlur={inputBlurHandler.bind(this, 'PaymentMethod')}
            options={['', 'Money', 'Card']}
          />
          <Input
            label="Total Price"
            id="TotalPrice"
            type="text"
            disabled={true}
            value={state.form.TotalPrice.value}
            valid={state.form.TotalPrice.valid}
            touched={state.form.TotalPrice.touched}
            onChange={inputChangeHandler}
            onBlur={inputBlurHandler.bind(this, 'TotalPrice')}
          />
          <Button btnName="Send" onClick={handleSubmit} />
        </Frame>
      )}
    </>
  );
}

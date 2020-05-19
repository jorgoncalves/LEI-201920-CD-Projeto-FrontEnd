import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import io from 'socket.io-client';
import Uikit from 'uikit';
import moment from 'moment';

import { required } from '../util/validators';
import { socketRegistos } from '../util/socket-address';

import Navbar from '../components/Navbar/Navbar';
import Loading from '../components/Loading/Loading';
import Frame from '../components/Form/Frame/Frame';
import Input from '../components/Form/Input/Input';
import Button from '../components/Form/Button/Button';
import Header from '../components/PageHeaders/Header';
import Modal from '../components/Modal/Modal';
import Select from '../components/Form/Select/Select';

export default function CarCheckout(props) {
  let history = useHistory();
  useEffect(() => {
    if (props.location.state === undefined) {
      history.push('/');
    }
  }, []);
  const [state, setState] = useState({
    form: {
      Register: {
        _id: '',
        valid: true,
      },
      LicensePlate: {
        value: '',
        valid: false,
        validators: [required],
      },
      Park: {
        _id: '',
        value: '',
        valid: false,
        validators: [required],
      },
      Place: {
        _id: '',
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

  const [stateReset] = useState(state);
  const [loading, setLoading] = useState(true);
  const [socket] = useState(io.connect(socketRegistos));

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
  }, []);
  useEffect(() => {
    if (!loading)
      setState((prevState) => {
        console.log(prevState);

        const updatedForm = { ...prevState.form };

        const findResult = prevState.allRegistos.find(
          (registo) =>
            registo.parque._id === props.location.state.parque.idParque
        );

        if (findResult) {
          const hora_entrada = moment(findResult.hora_entrada);
          const hora_saida = moment();

          const valor =
            moment.duration(hora_saida.diff(hora_entrada)).hours() === 0
              ? findResult.parque.precoPorHora
              : moment.duration(hora_saida.diff(hora_entrada)).hours() *
                findResult.parque.precoPorHora;
          console.log(findResult);
          updatedForm.Register._id = findResult._id;
          updatedForm.LicensePlate.value = findResult.matricula;
          updatedForm.LicensePlate.valid = true;
          updatedForm.Park._id = findResult.parque._id;
          updatedForm.Park.value = findResult.parque.nome;
          updatedForm.Park.valid = true;
          updatedForm.Place._id = findResult.lugar._id;
          updatedForm.Place.value = findResult.lugar.label;
          updatedForm.Place.valid = true;
          updatedForm.TotalPrice.value = valor;
          updatedForm.TotalPrice.valid = true;
        }
        return {
          ...state,
          form: updatedForm,
        };
      });
  }, [loading]);

  useEffect(() => {
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
  }, []);

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

      if (findResult) {
        const hora_entrada = moment(findResult.hora_entrada);
        const hora_saida = moment();

        const valor =
          moment.duration(hora_saida.diff(hora_entrada)).hours() === 0
            ? findResult.parque.precoPorHora
            : moment.duration(hora_saida.diff(hora_entrada)).hours() *
              findResult.parque.precoPorHora;

        updatedForm.Register._id = findResult._id;
        updatedForm.Park._id = findResult.parque._id;
        updatedForm.Park.value = findResult.parque.nome;
        updatedForm.Park.valid = true;
        updatedForm.Place._id = findResult.lugar._id;
        updatedForm.Place.value = findResult.lugar.label;
        updatedForm.Place.valid = true;
        updatedForm.TotalPrice.value = valor;
        updatedForm.TotalPrice.valid = true;
      } else if (input !== 'PaymentMethod') {
        updatedForm.Register._id = '';
        updatedForm.Park._id = '';
        updatedForm.Park.value = '';
        updatedForm.Park.valid = false;
        updatedForm.Place._id = '';
        updatedForm.Place.value = '';
        updatedForm.Place.valid = false;
        updatedForm.TotalPrice.value = '';
        updatedForm.TotalPrice.valid = false;
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
      idRegisto: state.form.Register._id,
      idCliente: '',
      matricula: state.form.LicensePlate.value,
      idParque: state.form.Park._id,
      idLugar: state.form.Place._id,
      forma: state.form.PaymentMethod.value,
      valor: state.form.TotalPrice.value,
    };
    socket.emit('registerSubmit', obj);
    console.log(obj);
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
            disabled={true}
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
          <Select
            label="Payment method"
            id="PaymentMethod"
            valid={state.form.PaymentMethod.valid}
            touched={state.form.PaymentMethod.touched}
            onChange={inputChangeHandler}
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

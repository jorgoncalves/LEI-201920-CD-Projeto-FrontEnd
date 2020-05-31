import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Uikit from 'uikit';

import { required } from '../../util/validators';
import {
  socketConnectRegistos,
  socketConnectClientes,
} from '../../util/sockets';

import Navbar from '../../components/Navbar/Navbar';
import Loading from '../../components/Loading/Loading';
import Frame from '../../components/Form/Frame/Frame';
import Input from '../../components/Form/Input/Input';
import Button from '../../components/Form/Button/Button';
import Header from '../../components/PageHeaders/Header';
import Modal from '../../components/Modal/Modal';
import InputIcon from '../../components/Form/Input/InputIcon';

export default function CarCheckin(props) {
  let history = useHistory();
  const [state, setState] = useState({
    form: {
      Client: {
        _id: '',
        value: '',
        valid: false,
        validators: [required],
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
        value: '',
        valid: false,
        validators: [required],
      },
    },
    formIsValid: false,
  });
  const [loading, setLoading] = useState(true);

  const getInitialData = () => {
    // socketConnectRegistos.emit('getAllRegistos');
    // socketConnectRegistos
    //   .off('responseGetAllRegistos')
    //   .on('responseGetAllRegistos', (data) => {
    //     const allRegistos = data.data;
    //     console.log(allRegistos);
    //     setState((prevState) => {
    //       return { ...prevState, allRegistos };
    //     });
    //   });
    setLoading(false);
  };

  const handleSubmitResponse = () => {
    socketConnectRegistos
      .off('responseNewRegistos')
      .on('responseNewRegistos', (data) => {
        console.log('got it ', data);
        if (data.status === 201) {
          socketConnectRegistos.close();
          Uikit.modal.alert('Car has been registered!').then(function () {
            history.push('/');
          });
        } else {
          socketConnectRegistos.close();
          Uikit.modal.alert(`Car hasn't been registered!`).then(function () {
            history.push('/');
          });
        }
      });
  };

  const generateLicensePlate = () => {
    const abc = 'ABCDEFGHIJKLMNOPQRSTUVXZ';
    const licensePlate = `${abc[Math.floor(Math.random() * 24)]}${
      abc[Math.floor(Math.random() * 24)]
    }-${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}-${
      abc[Math.floor(Math.random() * 24)]
    }${abc[Math.floor(Math.random() * 24)]}`;
    setState((prevState) => {
      const updatedForm = { ...prevState.form };
      console.log(updatedForm);
      updatedForm.LicensePlate.value = licensePlate;
      updatedForm.LicensePlate.valid = true;
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
      return {
        ...state,
        form: updatedForm,
      };
    });
  };

  useEffect(() => {
    if (state.form.LicensePlate.value.length === 8) {
      const obj = {
        matriculas: state.form.LicensePlate.value,
      };
      console.log(obj);
      socketConnectClientes.emit('findClient', obj);

      socketConnectClientes.on('responseFind', (clientData) => {
        console.log(clientData);
        if (clientData.data !== null)
          setState((prevState) => {
            const updatedForm = prevState.form;
            updatedForm.Client._id = clientData.data._id;
            updatedForm.Client.value = clientData.data.nome;
            updatedForm.Client.valid = true;

            let formIsValid = true;
            for (const inputName in updatedForm) {
              formIsValid = formIsValid && updatedForm[inputName].valid;
            }
            return {
              ...prevState,
              form: { ...updatedForm },
              formIsValid: formIsValid,
            };
          });
        else
          setState((prevState) => {
            const updatedForm = prevState.form;
            updatedForm.Client.value = 'No client found.';
            updatedForm.Client.valid = true;

            let formIsValid = true;
            for (const inputName in updatedForm) {
              formIsValid = formIsValid && updatedForm[inputName].valid;
            }
            return {
              ...prevState,
              form: { ...updatedForm },
              formIsValid: formIsValid,
            };
          });
      });
    } else if (state.form.LicensePlate.value.length < 8) {
      setState((prevState) => {
        const updatedForm = prevState.form;
        updatedForm.Client._id = '';
        updatedForm.Client.value = '';
        updatedForm.Client.valid = false;
        return {
          ...prevState,
          form: { ...updatedForm },
          formIsValid: false,
        };
      });
    }
    console.log(state);
  }, [state.form.LicensePlate.value]);

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
      idCliente: state.form.Client._id !== '' ? state.form.Client._id : null,
      matricula: state.form.LicensePlate.value,
      idParque: state.form.Park._id,
      idLugar: state.form.Place._id,
    };
    socketConnectRegistos.emit('createNewRegisto', obj);
    console.log(obj);
  };
  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      if (props.location.state === undefined) {
        history.push('/');
      }
      console.log(props.location);

      setState((prevState) => {
        return {
          ...prevState,
          form: {
            ...prevState.form,
            Park: {
              ...prevState.Park,
              _id: props.location.state.parque.idParque,
              value: props.location.state.parque.nome,
              valid: true,
            },
            Place: {
              ...prevState.Place,
              _id: props.location.state.lugar.idLugar,
              value: props.location.state.lugar.label,
              mobilidadeReduzida: props.location.state.lugar.mobilidadeReduzida,
              valid: true,
            },
          },
        };
      });
      socketConnectRegistos.open();
      socketConnectClientes.open();
      getInitialData();
      handleSubmitResponse();
    }
    return () => {
      isMounted = false;
      socketConnectRegistos.off('responseGetAllRegistos');
      socketConnectRegistos.off('responseNewRegistos');
      socketConnectRegistos.close();
      socketConnectClientes.close();
    };
  }, []);

  return (
    <>
      <Navbar onLogout={props.onLogout} isAdmin={props.isAdmin} />
      {loading ? (
        <Loading />
      ) : (
        <Frame>
          <Header header="Car checkin" />
          <Input
            label="Client"
            id="Client"
            type="text"
            placeholder=""
            disabled={true}
            value={state.form.Client.value}
          />
          <InputIcon
            label="License Plate"
            id="LicensePlate"
            type="text"
            maxLength="8"
            value={state.form.LicensePlate.value}
            valid={state.form.LicensePlate.valid}
            touched={state.form.LicensePlate.touched}
            onChange={inputChangeHandler}
            onBlur={inputBlurHandler.bind(this, 'LicensePlate')}
            icon="refresh"
            generateLicensePlate={generateLicensePlate}
          />
          <Input
            label="Park"
            id="Park"
            type="text"
            disabled={true}
            value={state.form.Park.value}
          />
          <InputIcon
            label="Place"
            id="Place"
            type="text"
            disabled={true}
            value={state.form.Place.value}
            mobilidadeReduzida={state.form.Place.mobilidadeReduzida}
            icon="wheelchair"
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

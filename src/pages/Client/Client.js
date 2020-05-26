import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Uikit from 'uikit';

import Navbar from '../../components/Navbar/Navbar';
import Frame from '../../components/Form/Frame/Frame';
import Input from '../../components/Form/Input/Input';
import Button from '../../components/Form/Button/Button';

import { required, numeric } from '../../util/validators';
import { socketConnectClientes } from '../../util/sockets';
import Loading from '../../components/Loading/Loading';
import Header from '../../components/PageHeaders/Header';

export default function Clients(props) {
  const history = useHistory();
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

    formIsValid: false,
  });
  const [stateReset, setStateReset] = useState(state);
  const getInitialData = () => {
    socketConnectClientes.emit('getCliente', { _id: props.userClientId });
    socketConnectClientes
      .off('responseCliente')
      .on('responseCliente', (data) => {
        console.log(data);
        const clientData = data.data;
        setState((prevState) => {
          const updatedForm = prevState.form;
          updatedForm.Name.value = clientData.nome;
          updatedForm.Name.valid = true;
          updatedForm.LicensePlate.value = clientData.matriculas;
          updatedForm.LicensePlate.valid = true;
          updatedForm.Charge.value = `${clientData.saldoEmCartao.toFixed(2).toString()}€`;
          updatedForm.Charge.valid = true;
          return { ...prevState, form: updatedForm };
        });
        setLoading(false);
      });
  };

  const handleSubmitResponse = () => {
    socketConnectClientes.off('responseUpdate').on('responseUpdate', (data) => {
      console.log('got it ', data);
      if (data.status === 200) {
        Uikit.modal.alert(`Client was updated!`).then(function () {
          history.push('/');
        });
      } else {
        socketConnectClientes.close();
        Uikit.modal.alert(`Client was not updated!`).then(function () {
          history.push('/');
        });
      }
      // Uikit.modal('#modalSocketResponse').show();
      console.log(state);
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
    let matriculas = state.form.LicensePlate.value;
    if (matriculas.includes(',')) {
      matriculas = matriculas.split(',');
    }
    const obj = {
      _id: props.userClientId,
      nome: state.form.Name.value,
      matriculas: matriculas,
      carregamento: state.form.Charge.value,
    };
    socketConnectClientes.emit('updateCliente', obj);
    console.log(state);
  };
  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      socketConnectClientes.open();
      getInitialData();
      handleSubmitResponse();
    }
    return () => {
      socketConnectClientes.close();
      isMounted = false;
    };
  }, []);
  return (
    <>
      {/* <Modal title={state.modal.title} message={state.modal.message} /> */}
      <Navbar onLogout={props.onLogout} isAdmin={props.isAdmin} />
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
            min="0"
            disabled={true}
            value={state.form.Charge.value}
            valid={state.form.Charge.valid}
            touched={state.form.Charge.touched}
            onChange={inputChangeHandler}
            onBlur={inputBlurHandler.bind(this, 'Charge')}
          />
          <Button
            btnName="Update"
            onClick={handleSubmit}
            disabled={!state.formIsValid}
          />
        </Frame>
      )}
    </>
  );
}

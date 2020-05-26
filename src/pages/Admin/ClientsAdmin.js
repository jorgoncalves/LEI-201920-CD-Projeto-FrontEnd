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
  const [waitResponse, setWaitResponse] = useState(false);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState({
    formFind: {
      Name: {
        value: '',
        valid: false,
        validators: [required],
      },
    },
    form: {
      _id: {
        value: '',
        valid: true,
        validators: [required],
      },
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
  const getInitialData = () => {
    setLoading(false);
  };

  const handleResponseFindByName = () => {
    socketConnectClientes
      .off('responseFind')
      .on('responseFind', (clientData) => {
        console.log(clientData);

        if (clientData.data !== null) {
          setState((prevState) => {
            const updatedForm = prevState.form;
            updatedForm._id.value = clientData.data._id;
            updatedForm.Name.value = clientData.data.nome;
            updatedForm.Name.valid = true;
            updatedForm.LicensePlate.value = clientData.data.matriculas;
            updatedForm.LicensePlate.valid = true;
            updatedForm.Charge.value = clientData.data.saldoEmCartao;
            updatedForm.Charge.valid = true;
            return { ...prevState, form: updatedForm };
          });
          setWaitResponse(false);
        } else {
          Uikit.modal.alert(`Client was not found!`);
        }
      });
  };

  const handleResponseUpdateByName = () => {
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

  const inputChangeHandlerFind = (input, value) => {
    setState((prevState) => {
      let isValid = true;
      for (const validator of prevState.formFind['Name'].validators) {
        isValid = isValid && validator(value);
      }
      const updatedForm = {
        ...prevState.formFind,
        [input]: {
          ...prevState.formFind[input],
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
        formFind: updatedForm,
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

  const handleSubmitFindByName = () => {
    setWaitResponse(true);
    const obj = {
      nome: state.formFind.Name.value,
      // matriculas: state.form.LicensePlate.value,
      // carregamento: state.form.Charge.value,
    };
    socketConnectClientes.emit('findClient', obj);
  };

  const handleSubmitUpdateClient = () => {
    setWaitResponse(true);
    const obj = {
      _id: state.form._id.value,
      nome: state.form.Name.value,
      matriculas: state.form.LicensePlate.value,
      carregamento: state.form.Charge.value,
    };
    socketConnectClientes.emit('updateCliente', obj);
  };
  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      socketConnectClientes.open();
      getInitialData();
      handleResponseFindByName();
      handleResponseUpdateByName();
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
            value={state.formFind.Name.value}
            valid={state.formFind.Name.valid}
            disabled={waitResponse}
            touched={state.formFind.Name.touched}
            onChange={inputChangeHandlerFind}
            // onBlur={inputBlurHandler.bind(this, 'Name')}
          />
          {state.form.LicensePlate.value !== '' &&
          state.form.Charge.value !== '' ? (
            <>
              <Input
                label="License plate (use comma to separate multiple)"
                id="LicensePlate"
                type="text"
                value={state.form.LicensePlate.value}
                valid={state.form.LicensePlate.valid}
                disabled={waitResponse}
                touched={state.form.LicensePlate.touched}
                onChange={inputChangeHandler}
                onBlur={inputBlurHandler.bind(this, 'LicensePlate')}
              />
              <Input
                label="Charge"
                id="Charge"
                type="number"
                min="0"
                value={state.form.Charge.value}
                valid={state.form.Charge.valid}
                disabled={waitResponse}
                touched={state.form.Charge.touched}
                onChange={inputChangeHandler}
                onBlur={inputBlurHandler.bind(this, 'Charge')}
              />
            </>
          ) : null}
          <Button
            btnName={
              state.form.LicensePlate.value !== '' &&
              state.form.Charge.value !== ''
                ? 'Update'
                : 'Find'
            }
            onClick={
              state.form.LicensePlate.value !== '' &&
              state.form.Charge.value !== ''
                ? handleSubmitUpdateClient
                : handleSubmitFindByName
            }
            disabled={!state.formIsValid || waitResponse}
          />
        </Frame>
      )}
    </>
  );
}

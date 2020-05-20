import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
// import io from 'socket.io-client';
import Uikit from 'uikit';

import { required } from '../util/validators';
// import { socketRegistos } from '../util/socket-address';
import { socketConnectRegistos } from '../util/sockets';

import Navbar from '../components/Navbar/Navbar';
import Loading from '../components/Loading/Loading';
import Frame from '../components/Form/Frame/Frame';
import Input from '../components/Form/Input/Input';
import Button from '../components/Form/Button/Button';
import Header from '../components/PageHeaders/Header';
import Modal from '../components/Modal/Modal';
import InputIcon from '../components/Form/Input/InputIcon';

export default function CarCheckin(props) {
  let history = useHistory();
  const [state, setState] = useState({
    form: {
      Client: {
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
    modal: {
      title: '',
      message: '',
    },
    formIsValid: false,
  });
  const [stateReset] = useState(state);
  const [loading, setLoading] = useState(true);

  const getInitialData = () => {
    socketConnectRegistos.emit('getAllRegistos');
    socketConnectRegistos
      .off('responseGetAllRegistos')
      .on('responseGetAllRegistos', (data) => {
        const allRegistos = data.data;
        console.log(allRegistos);
        setState((prevState) => {
          return { ...prevState, allRegistos };
        });
      });
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
          // setState((prevState) => {
          //   return {
          //     ...stateReset,
          //     modal: {
          //       title: 'Success!',
          //       message: 'Car has been registered!',
          //     },
          //   };
          // });
        } else {
          socketConnectRegistos.close();
          Uikit.modal.alert(`Car hasn't been registered!`).then(function () {
            history.push('/');
          });
          // setState({
          //   ...state,
          //   modal: {
          //     title: 'Failure!',
          //     message: `Car hasn't been registered!`,
          //   },
          // });
        }
        // Uikit.modal('#modalSocketResponse')
        //   .show()
        //   .then(() => {
        //     socketConnectRegistos.close();
        //     // history.push('/');
        //   });
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
      // const findResult = prevState.allRegistos.find(
      //   (registo) => registo.matricula === value
      // );

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
      // cliente: state.form.Register._id,
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
              valid: true,
            },
          },
        };
      });
      // Apenas registos em que saida == null
      socketConnectRegistos.open();
      getInitialData();
      handleSubmitResponse();
    }
    return () => {
      isMounted = false;
      socketConnectRegistos.off('responseGetAllRegistos');
      socketConnectRegistos.off('responseNewRegistos');
      socketConnectRegistos.close();
    };
  }, []);

  return (
    <>
      <Modal title={state.modal.title} message={state.modal.message} />
      <Navbar />
      {loading ? (
        <Loading />
      ) : (
        <Frame>
          <Header header="Car checkin" />
          <Input
            label="Client (optional/ not working)"
            id="Client"
            type="text"
            placeholder="Type the Client name"
            value={state.form.Client.value}
            valid={state.form.Client.valid}
            touched={state.form.Client.touched}
            onChange={inputChangeHandler}
            onBlur={inputBlurHandler.bind(this, 'Client')}
          />
          <InputIcon
            label="License Plate"
            id="LicensePlate"
            type="text"
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

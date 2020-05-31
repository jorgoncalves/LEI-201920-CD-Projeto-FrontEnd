import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Uikit from 'uikit';

import Navbar from '../../components/Navbar/Navbar';
import Frame from '../../components/Form/Frame/Frame';
import Input from '../../components/Form/Input/Input';
import Button from '../../components/Form/Button/Button';

import { required, numeric } from '../../util/validators';
import { socketConnectParques } from '../../util/sockets';
import Loading from '../../components/Loading/Loading';
import Header from '../../components/PageHeaders/Header';
import Alert from '../../components/Alert/Alert';

export default function Parks(props) {
  let history = useHistory();
  const [loading, setLoading] = useState(true);
  const [operation, setOperation] = useState(null);
  const [searchField, setSearchField] = useState(false);
  const [waitResponse, setWaitResponse] = useState(false);
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
    // socketConnectParques.emit('getAllParques');
    // socketConnectParques
    //   .off('responseGetAllParque')
    //   .on('responseGetAllParque', (data) => {
    //     const allParks = data.data;
    //     setState((prevState) => {
    //       return { ...prevState, allParks };
    //     });
    setLoading(false);
    // });
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

  const handleOperation = (type) => {
    console.log(type);
    if (type === 'update') {
      setSearchField(true);
    }
    setLoading(false);
    setOperation(type);
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

  const handleFindResponse = () => {
    socketConnectParques
      .off('responseFindPark')
      .on('responseFindPark', (data) => {
        console.log(data);

        if (data.data !== null) {
          setState((prevState) => {
            const updatedForm = prevState.form;
            updatedForm._id.value = data.data._id;
            updatedForm.Name.value = data.data.nome;
            updatedForm.Name.valid = true;
            updatedForm.Price.value = data.data.precoPorHora;
            updatedForm.Price.valid = true;
            updatedForm.NumOfSpaces.value = data.data.lugares.length;
            updatedForm.NumOfSpaces.valid = true;
            updatedForm.NumOfHandicape.value = data.data.lugares.filter(
              (lugar) => lugar.mobilidadeReduzida
            ).length;
            updatedForm.NumOfHandicape.valid = true;
            return { ...prevState, form: updatedForm };
          });
          setWaitResponse(false);
          setSearchField(false);
        } else {
          Uikit.modal.alert(`Park was not found!`).then(function () {
            history.push('/');
          });
        }
      });
    console.log(state);
  };

  const handleResponseUpdate = () => {
    socketConnectParques
      .off('respUpdateParque')
      .on('respUpdateParque', (data) => {
        console.log('got it ', data);
        if (data.status === 200) {
          Uikit.modal.alert(`Park was updated!`).then(function () {
            history.push('/');
          });
        } else {
          socketConnectParques.close();
          Uikit.modal.alert(`Park was not updated!`).then(function () {
            history.push('/');
          });
        }
        // Uikit.modal('#modalSocketResponse').show();
        console.log(state);
      });
  };

  const handleFind = () => {
    setWaitResponse(true);
    const obj = {
      nome: state.formFind.Name.value,
    };
    socketConnectParques.emit('findPark', obj);
  };

  const handleSubmit = () => {
    const obj = {
      nome: state.form.Name.value,
      precoPorHora: state.form.Price.value,
      numLugares: state.form.NumOfSpaces.value,
      numMobilidadeReduzida: state.form.NumOfHandicape.value,
    };
    socketConnectParques.emit('formSubmit', obj);
    // setWaitResponse(true);
    console.log(state);
  };

  const handleSubmitUpdate = () => {
    const obj = {
      _id: state.form._id.value,
      nome: state.form.Name.value,
      precoPorHora: state.form.Price.value,
      numLugares: state.form.NumOfSpaces.value,
      numMobilidadeReduzida: state.form.NumOfHandicape.value,
    };
    socketConnectParques.emit('formSubmitUpdate', obj);
    // setWaitResponse(true);
    console.log(state);
  };
  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      socketConnectParques.open();
      getInitialData();
      handleSubmitResponse();
      handleFindResponse();
      handleResponseUpdate();
    }
    return () => {
      socketConnectParques.close();
      isMounted = false;
    };
  }, []);
  return (
    <>
      <Navbar onLogout={props.onLogout} isAdmin={props.isAdmin} />
      {loading ? (
        <Loading />
      ) : (
        <Frame>
          <Header header="Park Management" />
          {operation ? (
            <>
              {searchField ? (
                <>
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
                  <Button btnName="Find" onClick={handleFind} />
                </>
              ) : (
                <>
                  {operation === 'update' ? (
                    <Alert text="Please only update when all the registers are closed." />
                  ) : null}
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
                  {console.log(operation)}
                  {console.log(searchField)}
                  <Button
                    btnName={operation === 'update' ? 'Update' : 'Create'}
                    onClick={
                      operation === 'update' ? handleSubmitUpdate : handleSubmit
                    }
                    disabled={!state.formIsValid}
                  />
                </>
              )}
            </>
          ) : (
            <div className="uk-flex uk-flex-center">
              <Button
                btnName="Update"
                onClick={handleOperation.bind(null, 'update')}
              />
              <Button
                btnName="Create"
                onClick={handleOperation.bind(null, 'create')}
              />
            </div>
          )}
        </Frame>
      )}
    </>
  );
}

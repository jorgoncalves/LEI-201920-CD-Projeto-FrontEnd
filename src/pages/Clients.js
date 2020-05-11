import React, { useState } from 'react';

import Navbar from '../components/Navbar/Navbar';
import Frame from '../components/Form/Frame/Frame';
import Input from '../components/Form/Input/Input';
import Button from '../components/Form/Button/Button';

import { required, numeric } from '../util/validators';

export default function Clients() {
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
  const inputChangeHandler = (input, value) => {
    console.log(input);

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
        form: updatedForm,
        formIsValid: formIsValid,
      };
    });
  };

  const inputBlurHandler = (input) => {
    setState((prevState) => {
      return {
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
    console.log(state);
  };
  return (
    <>
      <Navbar />
      <Frame>
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
        <Button btnName="Send" onClick={handleSubmit} />
      </Frame>
    </>
  );
}

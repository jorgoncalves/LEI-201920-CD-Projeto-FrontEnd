import React, { useState } from 'react';

import Navbar from '../components/Navbar/Navbar';
import Frame from '../components/Form/Frame/Frame';
import Input from '../components/Form/Input/Input';
import Button from '../components/Form/Button/Button';

import { required } from '../util/validators';

export default function Clients() {
  const [state, setState] = useState({
    form: {
      Name: {
        value: '',
        validators: [required],
      },
      LicensePlate: {
        value: '',
        validators: [required],
      },
      Charge: {
        value: '',
        validators: [required],
      },
      formIsValid: false,
    },
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
  return (
    <>
      <Navbar />
      <Frame>
        <Input
          label="Name"
          id="Name"
          type="text"
          value={state.form.Name.value}
          onChange={inputChangeHandler}
        />
        <Input
          label="License plate (use comma to separate multiple)"
          id="LicensePlate"
          type="text"
          value={state.form.LicensePlate.value}
          onChange={inputChangeHandler}
        />
        <Input
          label="Charge"
          id="Charge"
          type="text"
          value={state.form.Charge.value}
          onChange={inputChangeHandler}
        />
        <Button btnName="Send" />
      </Frame>
    </>
  );
}

import React, { useState, useEffect } from 'react';

import './Button.css'

export default function Button(props) {
  const [disabled, setDisabled] = useState(props.disabled);

  useEffect(() => {
    setDisabled(props.disabled);
  }, [props.disabled]);

  return (
    <>
      <button
        disabled={disabled}
        className="uk-button uk-button-default btnMarginRigth"
        onClick={props.onClick}
      >
        {props.loading ? 'Loading...' : props.btnName}
      </button>
    </>
  );
}

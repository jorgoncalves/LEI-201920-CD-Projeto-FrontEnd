import React, { useState, useEffect } from 'react';

export default function Button(props) {
  const [disabled, setDisabled] = useState(props.disabled);

  useEffect(() => {
    setDisabled(props.disabled);
  }, [props.disabled]);

  return (
    <>
      <button
        disabled={disabled}
        className="uk-button uk-button-default"
        onClick={props.onClick}
      >
        {props.btnName}
      </button>
    </>
  );
}

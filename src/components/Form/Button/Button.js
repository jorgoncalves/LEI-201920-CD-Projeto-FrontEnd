import React from 'react';

export default function Button(props) {
  return (
    <>
      <button className="uk-button uk-button-default" onClick={props.onClick}>
        {props.btnName}
      </button>
    </>
  );
}

import React from 'react';

export default function Button(props) {
  return (
    <>
      <button class="uk-button uk-button-default">{props.btnName}</button>
    </>
  );
}

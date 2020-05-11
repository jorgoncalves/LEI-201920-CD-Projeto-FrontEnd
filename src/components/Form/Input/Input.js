import React from 'react';

export default function Input(props) {
  return (
    <>
      <div className="uk-margin">
        <label class="uk-form-label" for={props.id}>
          {props.label}
        </label>
        <input
          id={props.id}
          onChange={(e) =>
            props.onChange(props.id, e.target.value, e.target.files)
          }
          value={props.value}
          className="uk-input"
          type={props.type}
        />
      </div>
    </>
  );
}

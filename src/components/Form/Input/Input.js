import React from 'react';

import './Input.css';

export default function Input(props) {
  return (
    <>
      <div className="uk-margin">
        <label className="uk-form-label" htmlFor={props.id}>
          {props.label}
        </label>
        <input
          className={[
            !props.valid ? `invalid` : `valid`,
            props.touched ? 'touched' : 'untouched',
            `uk-input`,
          ].join(' ')}
          type={props.type}
          id={props.id}
          min={props.min}
          disabled={props.disabled}
          placeholder={props.placeholder}
          value={props.value}
          onChange={(e) =>
            props.onChange(props.id, e.target.value, e.target.files)
          }
          onBlur={props.onBlur}
        />
      </div>
    </>
  );
}

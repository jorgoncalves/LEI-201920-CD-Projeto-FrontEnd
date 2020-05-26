import React from 'react';

import './Select.css';

export default function Select(props) {
  return (
    <>
      <div className="uk-margin">
        <label className="uk-form-label" htmlFor={props.id}>
          {props.label}
        </label>
        <select
          className={[
            !props.valid ? `invalid` : `valid`,
            props.touched ? 'touched' : 'untouched',
            'uk-select',
          ].join(' ')}
          id={props.id}
          onChange={(e) => props.onChange(props.id, e.target.value)}
          onBlur={props.onBlur}
        >
          {props.options.map((option, index) => {
            return (
              <option
                key={index}
                disabled={!props.isClient && option === 'Card'}
              >
                {option}
              </option>
            );
          })}
        </select>
      </div>
    </>
  );
}

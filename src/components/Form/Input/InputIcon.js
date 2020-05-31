import React from 'react';

import './InputIcon.css';

import wheelchairSVG from '../../../img/Wheelchair_symbol.svg';

export default function InputIcon(props) {
  return (
    <>
      <div className="uk-margin">
        <label className="uk-form-label" htmlFor={props.id}>
          {props.label}
        </label>
        <div className="uk-inline">
          {props.mobilidadeReduzida ? (
            <span className="uk-form-icon uk-form-icon-flip">
              <img src={wheelchairSVG} alt="" srcset="" />
            </span>
          ) : (
            <a
              className="uk-form-icon uk-form-icon-flip"
              href="#"
              uk-icon={`icon: ${props.icon}`}
              onClick={props.generateLicensePlate}
            ></a>
          )}
          <input
            className={[
              !props.valid ? `invalid` : `valid`,
              props.touched ? 'touched' : 'untouched',
              `uk-input`,
            ].join(' ')}
            type={props.type}
            id={props.id}
            maxLength={props.maxLength}
            disabled={props.disabled}
            placeholder={props.placeholder}
            value={props.value}
            onChange={(e) =>
              props.onChange(props.id, e.target.value, e.target.files)
            }
            onBlur={props.onBlur}
          />
        </div>
      </div>
    </>
  );
}

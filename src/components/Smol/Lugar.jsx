import React from 'react';
import './ocupado.css';

import './Lugar.css';

export default function Lugar(props) {
  return (
    <>
      <span>
        <b>{props.label}</b>
        {!props.ocupado ? (
          <b className="livre">Livre</b>
        ) : (
          <b className="ocupado">Ocupado</b>
        )}
      </span>
    </>
  );
}

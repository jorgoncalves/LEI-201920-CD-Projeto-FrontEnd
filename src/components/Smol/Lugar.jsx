import React from 'react';
import './ocupado.css';
import { Link } from 'react-router-dom';

import './Lugar.css';

export default function Lugar(props) {
  return (
    <>
      <span>
        <b>{props.label}</b>
        {!props.ocupado ? (
          <Link
            to={{
              pathname: '/car-checkin',
              state: {
                parque: { idParque: props.idParque, nome: props.nomeParque },
                lugar: { idLugar: props.idLugar, label: props.label },
              },
            }}
          >
            <b className="livre">Livre</b>{' '}
          </Link>
        ) : (
          <Link
            to={{
              pathname: '/car-checkout',
              state: {
                parque: { idParque: props.idParque, nome: props.nomeParque },
                lugar: { idLugar: props.idLugar, label: props.label },
              },
            }}
          >
            <b className="ocupado">Ocupado</b>
          </Link>
        )}
      </span>
    </>
  );
}

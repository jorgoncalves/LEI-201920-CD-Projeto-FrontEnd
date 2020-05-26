import React from 'react';
import './ocupado.css';
import { Link } from 'react-router-dom';

import './Lugar.css';

import wheelchairSVG from '../../img/Wheelchair_symbol.svg';

export default function Lugar(props) {
  const lugarClient = (
    <>
      <div className="uk-card uk-card-default uk-card-hover uk-card-body lugarContainer">
        <span className="uk-text-bold">Place - {props.label}</span>
        {!props.ocupado ? (
          <span className="lugarState uk-text-bold livre">Free</span>
        ) : (
          <span className="lugarState uk-text-bold ocupado">Occupied</span>
        )}
        {props.mobilidadeReduzida === true && (
          <span className="iconMobilidadeReduzida" uk-icon="cart"></span>
        )}
      </div>
    </>
  );
  const lugarAdmin = (
    <>
      <Link
        className=" uk-text-bold"
        to={
          !props.ocupado
            ? {
                pathname: '/car-checkin',
                state: {
                  parque: { idParque: props.idParque, nome: props.nomeParque },
                  lugar: { idLugar: props.idLugar, label: props.label },
                },
              }
            : {
                pathname: '/car-checkout',
                state: {
                  parque: { idParque: props.idParque, nome: props.nomeParque },
                  lugar: { idLugar: props.idLugar, label: props.label },
                },
              }
        }
      >
        <span className="uk-card uk-card-default uk-card-hover uk-card-body lugarContainer">
          <span className="uk-text-bold">Place - {props.label}</span>
          {!props.ocupado ? (
            <span className="lugarState livre">Free</span>
          ) : (
            <span className="lugarState ocupado">Occupied</span>
          )}
          {props.mobilidadeReduzida === true && (
            <span className="iconMobilidadeReduzida"><img src={wheelchairSVG} alt="" srcset=""/></span>
          )}
        </span>
      </Link>
    </>
  );

  return <>{props.isAdmin ? lugarAdmin : lugarClient}</>;
}

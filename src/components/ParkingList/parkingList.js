import React, { useState } from 'react';
import "./parkingList.css";
import OcupadoLbl from "../Smol/ocupado"
import LivreLbl from "../Smol/livre"

export default function PendingSection(props) {
  const [state, setState] = useState({
    nthParq: 0,
  });
  return (
    <div className="uk-card-default">
      <div className="uk-card-body uk-card-small">
        <ul
          className="uk-subnav uk-subnav-pill"
          uk-switcher="animation: uk-animation-fade"
        >
          {props.parques
          .map((parques, index) => {
            return (
              <li  key={index}>
                <a href="#">{parques.nome}</a>
              </li>
            );
          })}
        </ul>
        <ul className="uk-switcher uk-margin">
          {props.parques
          .map((parque, index) => {
            return (
              <li key={index} className="parentFlex uk-list uk-list-large uk-list-striped">
                {parque.lugares
                .map((lugar, index) => {
                  return (
                    <li className="childFlex" key={index}>
                      <b>{lugar.label}</b> {lugar.ocupado ? <OcupadoLbl/>: <LivreLbl/>}
                    </li>
                  );
                })}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

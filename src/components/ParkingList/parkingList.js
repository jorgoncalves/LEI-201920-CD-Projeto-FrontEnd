import React from 'react';
import './ParkingList.css';
import Lugar from '../Smol/Lugar';

import Header from '../PageHeaders/Header';

export default function ParkingList(props) {
  return (
    <div className="uk-card-default">
      <div className="uk-card-body uk-card-small">
        <ul
          className="uk-subnav uk-subnav-pill"
          uk-switcher="animation: uk-animation-fade"
        >
          {props.parques.map((parques, index) => {
            return (
              <li key={index}>
                <a>{parques.nome}</a>
              </li>
            );
          })}
        </ul>
        <ul className="uk-switcher uk-margin">
          {props.parques.map((parque, index) => {
            return (
              <div key={index}>
                <Header
                  header={`${(
                    (parque.lugares.filter((lugar) => lugar.ocupado === true)
                      .length /
                      parque.lugares.length) *
                    100
                  ).toFixed(1)}% Occupied`}
                  second={`Price by hour: ${parque.precoPorHora}`}
                />
                <div className="parentFlex">
                  {parque.lugares.map((lugar, index) => {
                    return (
                      <li className="childFlex" key={index}>
                        <Lugar
                          idParque={parque._id}
                          nomeParque={parque.nome}
                          idLugar={lugar._id}
                          label={lugar.label}
                          ocupado={lugar.ocupado}
                          mobilidadeReduzida={lugar.mobilidadeReduzida}
                          isAdmin={props.isAdmin}
                        />
                      </li>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

import React from 'react';
import moment from 'moment';

import './HistoryCard.css';

export default function HistoryCard(props) {
  const valor =
    moment.duration(moment().diff(props.hora_entrada)).hours() === 0
      ? props.parque.precoPorHora
      : moment.duration(moment().diff(props.hora_entrada)).hours() *
        props.parque.precoPorHora;

  return (
    <>
      <div className="uk-margin">
        <div className="uk-card uk-card-default uk-card-small uk-card-body uk-card-hover card-history">
          <div className="uk-flex uk-flex-between">
            <span className="uk-text-small">
              <span className="uk-text-bold">Park: </span>
              {props.parque.nome}
            </span>
            <span className="uk-text-small">
              <span className="uk-text-bold">Place: </span>
              {props.lugar.label}
            </span>
          </div>
          <span className="uk-text-small">
            <span className="uk-text-bold">License Plate: </span>
            {props.matricula}
          </span>
          <div className="uk-flex uk-flex-between">
            <span className="uk-text-small">
              <span className="uk-text-bold">Since: </span>
              {moment(props.hora_entrada).format('HH:mm DD-MM-YYYY')}
            </span>
            <span className="uk-text-small">
              <span className="uk-text-bold">Until:</span>
              {props.hora_saida !== undefined
                ? moment(props.hora_saida).format('HH:mm DD-MM-YYYY')
                : 'Still there'}
            </span>
          </div>
          {props.pagamento !== undefined &&
          props.pagamento.forma !== undefined &&
          props.pagamento.valor !== undefined ? (
            <div className="uk-flex uk-flex-between">
              <span className="uk-text-small">
                <span className="uk-text-bold">Payment method: </span>
                {props.pagamento.forma}
              </span>
              <span className="uk-text-small">
                <span className="uk-text-bold">Payed:</span>
                {props.pagamento.valor}
              </span>
            </div>
          ) : (
            <div className="uk-flex uk-flex-between">
              <span className="uk-text-small">
                <span className="uk-text-bold">Cost until now: </span>
                {valor.toFixed(2)}€
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

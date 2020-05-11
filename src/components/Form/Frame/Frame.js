import React from 'react';

import './Frame.css'

export default function Frame(props) {
  return (
    <div className="frameContainer">
      <div className="uk-card uk-card-large uk-card-body">
        {/* <h3 className="uk-card-title">{props.title}</h3> */}
        {props.children}
      </div>
    </div>
  );
}

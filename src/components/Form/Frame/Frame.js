import React from 'react';

import './Frame.css';

export default function Frame(props) {
  return (
    <div className={props.fullWidth === true ? null : 'frameContainer'}>
      <div className="uk-card uk-card-large uk-card-body">{props.children}</div>
    </div>
  );
}

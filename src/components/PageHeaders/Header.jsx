import React from 'react';

export default function Header(props) {
  if (props.second) {
    return (
      <div className="uk-placeholder uk-text-center uk-padding-small uk-flex uk-flex-between">
        <div className="uk-text-bold">{props.header}</div>
        <div className="uk-text-bold">{props.second}</div>
      </div>
    );
  } else {
    return (
      <div className="uk-placeholder uk-text-center uk-padding-small">
        {props.header}
      </div>
    );
  }
}

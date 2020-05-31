import React from 'react';

export default function Alert(props) {
  return (
    <div className="uk-alert-danger" uk-alert={true}>
      {/* <a class="uk-alert-close" uk-close></a> */}
      <p>{props.text}</p>
    </div>
  );
}

import React from 'react';

export default function Modal(props) {
  return (
    <>
      <div id="modalSocketResponse" uk-modal="true">
        <div className="uk-modal-dialog uk-modal-body">
          <button
            className="uk-modal-close-default"
            type="button"
            uk-close="true"
          ></button>
          <h2 className="uk-modal-title">{props.title}</h2>
          <p>{props.message}</p>
        </div>
      </div>
    </>
  );
}

import React from 'react';

export default function Header(props) {
  return (
    <div className="uk-placeholder uk-text-center uk-padding-small">
      {props.header}
    </div>
  );
}

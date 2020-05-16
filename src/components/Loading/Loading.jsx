import React from 'react';

import './Loading.css';

export default function Loading() {
  return (
    <div className="spinnerCenter">
      <div uk-spinner="ratio: 3"></div>
    </div>
  );
}

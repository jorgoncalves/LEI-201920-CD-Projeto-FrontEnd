import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  return (
    <div>
      <nav className="uk-navbar-container uk-margin" uk-navbar="mode: click">
        <div className="uk-navbar-left">
          <ul className="uk-navbar-nav">
            <li className="">
              <Link
                className={useLocation().pathname === '/' ? 'uk-active' : ''}
                to="/"
              >
                Home
              </Link>
            </li>
            <li>
              <Link to="/">Other</Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

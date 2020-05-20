import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  return (
    <div className="">
      <nav className="uk-navbar-container uk-margin" uk-navbar="mode: click">
        <div className="uk-navbar-left ">
          <ul className="uk-navbar-nav">
            <li className={useLocation().pathname === '/' ? 'uk-active' : ''}>
              <Link to={{ pathname: '/', state: 'test' }}>Home</Link>
            </li>
            {/* <li
              disabled={true}
              className={
                useLocation().pathname === '/car-checkin' ? 'uk-active' : ''
              }
            >
              <Link to="/car-checkin">Car Checkin</Link>
            </li>
            <li
              className={
                useLocation().pathname === '/car-checkout' ? 'uk-active' : ''
              }
            >
              <Link to="/car-checkout">Car Checkout</Link>
            </li> */}
            <li
              className={
                useLocation().pathname === '/clients' ? 'uk-active' : ''
              }
            >
              <Link to={{ pathname: '/clients' }}>Clients</Link>
            </li>
            <li
              className={useLocation().pathname === '/parks' ? 'uk-active' : ''}
            >
              <Link to={{ pathname: '/parks' }}>Parks</Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

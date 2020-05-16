import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  return (
    <div className="">
      <nav className="uk-navbar-container uk-margin" uk-navbar="mode: click">
        <div className="uk-navbar-left ">
          <ul className="uk-navbar-nav uk-light ">
            <li className="">
              <Link
                className={useLocation().pathname === '/' ? 'uk-active' : ''}
                to="/"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                className={
                  useLocation().pathname === '/car-checkin' ? 'uk-active' : ''
                }
                to="/car-checkin"
              >
                Car Checkin
              </Link>
            </li>
            <li>
              <Link
                className={
                  useLocation().pathname === '/car-checkout' ? 'uk-active' : ''
                }
                to="/car-checkout"
              >
                Car Checkout
              </Link>
            </li>
            <li>
              <Link
                className={
                  useLocation().pathname === '/clients' ? 'uk-active' : ''
                }
                to="/clients"
              >
                Clients
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

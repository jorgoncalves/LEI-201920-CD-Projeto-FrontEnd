import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar(props) {
  const [isAdmin, setIsAdmin] = useState(props.isAdmin);

  useEffect(() => {
    setIsAdmin(props.isAdmin);
  }, [props.isAdmin]);

  const clientNavbar = (
    <>
      <li className={useLocation().pathname === '/' ? 'uk-active' : ''}>
        <Link to={{ pathname: '/', state: 'test' }}>Home</Link>
      </li>
      <li className={useLocation().pathname === '/client' ? 'uk-active' : ''}>
        <Link to={{ pathname: '/client' }}>Client</Link>
      </li>
      <li className={useLocation().pathname === '/history' ? 'uk-active' : ''}>
        <Link to={{ pathname: '/history' }}>History</Link>
      </li>
    </>
  );

  const adminNavbar = (
    <>
      <li className={useLocation().pathname === '/' ? 'uk-active' : ''}>
        <Link to={{ pathname: '/', state: 'test' }}>Home</Link>
      </li>
      <li className={useLocation().pathname === '/clients' ? 'uk-active' : ''}>
        <Link to={{ pathname: '/clients' }}>Clients</Link>
      </li>
      <li className={useLocation().pathname === '/parks' ? 'uk-active' : ''}>
        <Link to={{ pathname: '/parks' }}>Parks</Link>
      </li>
    </>
  );

  return (
    <div className="">
      <nav className="uk-navbar-container uk-margin" uk-navbar="mode: click">
        <div className="uk-navbar-left">
          <ul className="uk-navbar-nav">
            {isAdmin ? adminNavbar : clientNavbar}
          </ul>
        </div>
        <div className="uk-navbar-right">
          <ul className="uk-navbar-nav">
            <li>
              <a onClick={props.onLogout}>Logout</a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

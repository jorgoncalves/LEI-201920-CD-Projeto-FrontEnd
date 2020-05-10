import React from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

import Home from './pages/Home';

import './App.css';

const App = () => {
  let routes = (
    <>
      <Route path="/" exact render={(props) => <Home {...props} />} />
      {/* <Route path="/home" exact render={(props) => <Home {...props} />} /> */}
    </>
  );
  return (
    <Switch>
      {routes}
      <Redirect to="/" />
    </Switch>
  );
};

export default withRouter(App);

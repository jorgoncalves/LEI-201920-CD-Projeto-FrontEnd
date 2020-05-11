import React from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

import Home from './pages/Home';

const App = () => {
  // const state= {
  //   token: null
  // }
  let routes = (
    <>
      {/* /home definido só para testes */}
      <Route path="/" exact render={(props) => <Home {...props} />} />

    </>
  );
  // Quando estiver feito à autenticação, colocar o if a apontar para variavel
  return (
    <Switch>
      {routes}
      <Redirect to="/" />
    </Switch>
  );
};

export default withRouter(App);

import React from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

import Home from './pages/Home';
import CarCheckin from './pages/CarCheckin';
import CarCheckout from './pages/CarCheckout';
import Clients from './pages/Clients';

const App = () => {
  // const state= {
  //   token: null
  // }
  let routes = (
    <>
      {/* /home definido só para testes */}
      <Route path="/" exact render={(props) => <Home {...props} />} />
      <Route
        path="/car-checkin"
        render={(props) => <CarCheckin {...props} />}
      />
      <Route
        path="/car-checkout"
        render={(props) => <CarCheckout {...props} />}
      />
      <Route path="/clients" render={(props) => <Clients {...props} />} />
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

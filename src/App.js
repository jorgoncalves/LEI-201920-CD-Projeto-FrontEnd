import React from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

import Home from './pages/Home';
import CarCheckin from './pages/CarCheckin';
import CarCheckout from './pages/CarCheckout';
import Clients from './pages/Clients';
import Park from './pages/Park';

const App = () => {
  // const state= {
  //   token: null
  // }
  let routes = (
    <>
      {/* /home definido só para testes */}
      <Route path="/" exact component={Home} />
      <Route path="/car-checkin" component={CarCheckin} />
      <Route path="/car-checkout" component={CarCheckout} />
      <Route path="/clients" component={Clients} />
      <Route path="/parks" component={Park} />
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

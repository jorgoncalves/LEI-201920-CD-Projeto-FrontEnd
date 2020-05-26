import React, { useState, useEffect } from 'react';
import {
  Route,
  Switch,
  Redirect,
  withRouter,
  useHistory,
} from 'react-router-dom';
import UIkit from 'uikit';

import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Home from './pages/Home';
import CarCheckin from './pages/Admin/CarCheckin';
import CarCheckout from './pages/Admin/CarCheckout';
import Client from './pages/Client/Client';
import ClientsAdmin from './pages/Admin/ClientsAdmin';
import Park from './pages/Park';
import ClientHistory from './pages/Client/ClientHistory';

export default withRouter(function App() {
  const [state, setState] = useState({
    isAuth: false,
    token: null,
    userAuthId: null,
    userClientId: null,
    isAdmin: null,
    authLoading: false,
    error: null,
  });
  let history = useHistory();

  const logoutHandler = () => {
    setState({
      isAuth: false,
      token: null,
      userAuthId: null,
      userClientId: null,
      isAdmin: null,
      authLoading: false,
      error: null,
    });
    localStorage.removeItem('token');
    localStorage.removeItem('isAuth');
    localStorage.removeItem('expiryDate');
    localStorage.removeItem('userAuthId');
    localStorage.removeItem('userClientId');
    localStorage.removeItem('isAdmin');
    history.push('/');
  };
  const setAutoLogout = (milliseconds) => {
    setTimeout(() => {
      logoutHandler();
    }, milliseconds);
  };

  const errorHandler = () => {
    setState({ error: null });
  };

  const loginHandler = (e, authData, socketConnectAuth) => {
    e.preventDefault();
    setState({ authLoading: true });
    console.log(authData);
    socketConnectAuth.emit('login', authData);
    socketConnectAuth.off('responseLogin').on('responseLogin', (resp) => {
      console.log(resp);
      try {
        if (resp.status === 422) {
          throw new Error('Validation failed.');
        }
        if (resp.status !== 200 && resp.status !== 201) {
          console.log('Error!');
          throw new Error('Could not authenticate you!');
        }
        setState({
          isAuth: true,
          token: resp.data.token,
          authLoading: false,
          userAuthId: resp.data.userAuthId,
          userClientId: resp.data.userClientId,
          isAdmin: resp.data.isAdmin,
        });
        localStorage.setItem('token', resp.data.token);
        localStorage.setItem('isAuth', true);
        localStorage.setItem('userAuthId', resp.data.userAuthId);
        localStorage.setItem('userClientId', resp.data.userClientId);
        localStorage.setItem('isAdmin', resp.data.isAdmin);
        const remainingMilliseconds = 60 * 60 * 1000;
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        );
        localStorage.setItem('expiryDate', expiryDate.toISOString());
        setAutoLogout(remainingMilliseconds);
      } catch (error) {
        UIkit.modal.dialog(`<p class="uk-modal-body">${error.message}</p>`);
        setState({
          isAuth: false,
          token: null,
          userAuthId: null,
          userClientId: null,
          isAdmin: null,
          authLoading: false,
          error: error,
        });
      }
    });
  };
  const signupHandler = (e, authData, socketConnectAuth) => {
    e.preventDefault();
    console.log(authData);
    setState({ authLoading: true });
    socketConnectAuth.emit('signup', authData);
    socketConnectAuth.off('responseSignup').on('responseSignup', (resp) => {
      console.log(resp);
      try {
        if (resp.status === 422) {
          throw new Error('Validation failed.');
        }
        if (resp.status !== 200 && resp.status !== 201) {
          console.log('Error!');
          throw new Error('Could not create your account!');
        }
        setState({
          isAuth: true,
          token: resp.data.token,
          authLoading: false,
          userAuthId: resp.data.userAuthId,
          userClientId: resp.data.userClientId,
          isAdmin: resp.data.isAdmin,
        });
        localStorage.setItem('token', resp.data.token);
        localStorage.setItem('isAuth', true);
        localStorage.setItem('userAuthId', resp.data.userAuthId);
        localStorage.setItem('userClientId', resp.data.userClientId);
        localStorage.setItem('isAdmin', resp.data.isAdmin);
        const remainingMilliseconds = 60 * 60 * 1000;
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        );
        localStorage.setItem('expiryDate', expiryDate.toISOString());
        setAutoLogout(remainingMilliseconds);
        history.push('/');
      } catch (error) {
        UIkit.modal.dialog(`<p class="uk-modal-body">${error.message}</p>`);
        setState({
          isAuth: false,
          token: null,
          userAuthId: null,
          userClientId: null,
          isAdmin: null,
          authLoading: false,
          error: error,
        });
      }
    });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const expiryDate = localStorage.getItem('expiryDate');
    if (!token || !expiryDate) {
      return;
    }
    if (new Date(expiryDate) <= new Date()) {
      logoutHandler();
      return;
    }
    const isAuth = localStorage.getItem('isAuth') === 'true';
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const userAuthId = localStorage.getItem('userAuthId');
    const userClientId = localStorage.getItem('userClientId');
    const remainingMilliseconds =
      new Date(expiryDate).getTime() - new Date().getTime();
    setState({
      isAuth: isAuth,
      isAdmin: isAdmin,
      token: token,
      userAuthId: userAuthId,
      userClientId: userClientId,
    });
    setAutoLogout(remainingMilliseconds);
    return () => {};
  }, []);

  let routes = (
    <>
      <Route
        path="/"
        exact
        render={(props) => (
          <Login
            {...props}
            onLogin={loginHandler}
            loading={state.authLoading}
          />
        )}
      />
      <Route
        path="/signup"
        render={(props) => (
          <Signup
            {...props}
            onSignup={signupHandler}
            loading={state.authLoading}
          />
        )}
      />
    </>
  );
  if (state.isAuth && !state.isAdmin) {
    routes = (
      <>
        <Route
          path="/"
          exact
          render={(props) => (
            <Home
              {...props}
              userAuthId={state.userAdminId}
              userClientId={state.userClientId}
              token={state.token}
              isAdmin={state.isAdmin}
              onLogout={logoutHandler}
            />
          )}
        />
        <Route
          path="/client"
          render={(props) => (
            <Client
              {...props}
              userAuthId={state.userAdminId}
              userClientId={state.userClientId}
              token={state.token}
              isAdmin={state.isAdmin}
              onLogout={logoutHandler}
            />
          )}
        />
        <Route
          path="/history"
          render={(props) => (
            <ClientHistory
              {...props}
              userAuthId={state.userAdminId}
              userClientId={state.userClientId}
              token={state.token}
              isAdmin={state.isAdmin}
              onLogout={logoutHandler}
            />
          )}
        />
      </>
    );
  } else if (state.isAuth && state.isAdmin) {
    routes = (
      <>
        <Route
          path="/"
          exact
          render={(props) => (
            <Home
              {...props}
              userAuthId={state.userAdminId}
              userClientId={state.userClientId}
              token={state.token}
              isAdmin={state.isAdmin}
              onLogout={logoutHandler}
            />
          )}
        />
        <Route
          path="/car-checkin"
          render={(props) => (
            <CarCheckin
              {...props}
              userAuthId={state.userAdminId}
              userClientId={state.userClientId}
              token={state.token}
              isAdmin={state.isAdmin}
              onLogout={logoutHandler}
            />
          )}
        />
        <Route
          path="/car-checkout"
          render={(props) => (
            <CarCheckout
              {...props}
              userAuthId={state.userAdminId}
              userClientId={state.userClientId}
              token={state.token}
              isAdmin={state.isAdmin}
              onLogout={logoutHandler}
            />
          )}
        />
        <Route
          path="/clients"
          render={(props) => (
            <ClientsAdmin
              {...props}
              userAuthId={state.userAdminId}
              userClientId={state.userClientId}
              token={state.token}
              isAdmin={state.isAdmin}
              onLogout={logoutHandler}
            />
          )}
        />
        <Route
          path="/parks"
          render={(props) => (
            <Park
              {...props}
              userAuthId={state.userAdminId}
              userClientId={state.userClientId}
              token={state.tken}
              isAdmin={state.isAdmin}
              onLogout={logoutHandler}
            />
          )}
        />
      </>
    );
  }
  return (
    <Switch>
      {routes}
      <Redirect to="/" />
    </Switch>
  );
});

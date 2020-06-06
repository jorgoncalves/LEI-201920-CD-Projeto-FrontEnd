import React, { useState, useEffect } from 'react';
import ParkingList from '../components/ParkingList/ParkingList';

import './Home.css';
import Navbar from '../components/Navbar/Navbar';
import Header from '../components/PageHeaders/Header';
import Loading from '../components/Loading/Loading';

import { socketConnectParques } from '../util/sockets';
import Frame from '../components/Form/Frame/Frame';

export default function Home(props) {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState();
  const [isAdmin, setIsAdmin] = useState(props.isAdmin);

  const getInitialData = () => {
    socketConnectParques.emit('getAllParques', { token: props.token });
    socketConnectParques
      .off('responseGetAllParque')
      .on('responseGetAllParque', (data) => {
        const parques = data.data;
        console.log(parques);
        setState((prevState) => {
          return parques;
        });
        setLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      socketConnectParques.open();
      getInitialData();
    }
    return () => {
      socketConnectParques.close();
      isMounted = false;
    };
  }, []);
  
  useEffect(() => {
    setIsAdmin(props.isAdmin);
  }, [props.isAdmin]);
  return (
    <>
      <Navbar onLogout={props.onLogout} isAdmin={isAdmin} />
      {loading ? (
        <Loading />
      ) : (
        <Frame fullWidth={true}>
          <Header header="Select one parking space" />
          <ParkingList parques={state} isAdmin={props.isAdmin} />
        </Frame>
      )}
    </>
  );
}

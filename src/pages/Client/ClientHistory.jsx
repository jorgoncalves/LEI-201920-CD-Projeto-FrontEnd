import React, { useState, useEffect } from 'react';
import Uikit from 'uikit';

import Navbar from '../../components/Navbar/Navbar';
import Frame from '../../components/Form/Frame/Frame';
import Loading from '../../components/Loading/Loading';
import Header from '../../components/PageHeaders/Header';

import { socketConnectClientes } from '../../util/sockets';
import HistoryCard from '../../components/Cards/HistoryCard';

export default function ClientHistory(props) {
  const [clienteHistoryData, setClienteHistoryData] = useState();
  const [loading, setLoading] = useState(true);

  const getInitialData = () => {
    socketConnectClientes.emit('getClientHistory', { _id: props.userClientId });
    socketConnectClientes
      .off('responseClientHistory')
      .on('responseClientHistory', (clientData) => {
        console.log(clientData);
        setClienteHistoryData((prevState) => {
          return clientData.data.data;
        });
        setLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      socketConnectClientes.open();
      getInitialData();
    }
    return () => {
      socketConnectClientes.close();
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Navbar onLogout={props.onLogout} isAdmin={props.isAdmin} />
      {loading ? (
        <Loading />
      ) : (
        <Frame>
          <Header header="Client History" />
          {console.log(clienteHistoryData)}
          {clienteHistoryData.map((history, index) => (
            <HistoryCard key={index} {...history} />
          ))}
        </Frame>
      )}
    </>
  );
}

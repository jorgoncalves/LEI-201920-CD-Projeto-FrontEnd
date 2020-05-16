import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import ParkingList from '../components/ParkingList/ParkingList';

import './Home.css';
import Navbar from '../components/Navbar/Navbar';

import { socketParques } from '../util/socket-address';
import Loading from '../components/Loading/Loading';

function Home() {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState();
  const [socket, setSocket] = useState(io.connect(socketParques));

  useEffect(() => {
    socket.on('connect', () => {
      socket.emit('getAllParques');
      socket.on('responseGetAllParque', (data) => {
        const parques = data.data;
        setState((prevState) => {
          return parques;
        });
        setLoading(false);        
      });
    });
  });

  return (
    <>
      <Navbar />
      {loading ? (
        <Loading />
      ) : (
        <div className="Container">
          <ParkingList parques={state} />
        </div>
      )}
    </>
  );
}

export default Home;

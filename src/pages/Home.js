import React, { useState } from 'react';
import ParkingList from '../components/ParkingList/parkingList';

import './Home.css';

function Home() {
  const [state, setState] = useState({
    parques: [{
      nome: "Norte Shopping",
      precoPorHora: 0.7,
      lugares: [{
        label: "A1",
        ocupado: false,
      },{
        label: "A2",
        ocupado: false,
      },{
        label: "A3",
        ocupado: true,
      },{
        label: "A4",
        ocupado: false,
      },{
        label: "A5",
        ocupado: true,
      },{
        label: "A6",
        ocupado: false,
      },{
        label: "A2",
        ocupado: false,
      },{
        label: "A3",
        ocupado: true,
      },{
        label: "A4",
        ocupado: false,
      },{
        label: "A5",
        ocupado: true,
      },{
        label: "A6",
        ocupado: false,
      }],
    },{
      nome: "Maia Shopping",
      precoPorHora: 0.7,
      lugares: [{
        label: "AA1",
        ocupado: false,
      },{
        label: "AA2",
        ocupado: true,
      },{
        label: "AA3",
        ocupado: true,
      },{
        label: "AA4",
        ocupado: false,
      },{
        label: "AA5",
        ocupado: false,
      },{
        label: "AA6",
        ocupado: true,
      }],
    }]
  });

  return (
    <>
      <div class="Container">
        <ParkingList parques={state.parques}/>
      </div>
    </>
  );
}

export default Home;

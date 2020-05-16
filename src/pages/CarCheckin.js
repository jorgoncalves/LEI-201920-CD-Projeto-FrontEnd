import React, {useState} from 'react';

import Navbar from '../components/Navbar/Navbar';
import Loading from '../components/Loading/Loading';

export default function CarCheckin() {
  const [loading, setLoading] = useState(true);
  return (
    <>
      <Navbar />
      {loading ? <Loading /> : null}
    </>
  );
}

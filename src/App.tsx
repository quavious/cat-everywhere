import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Main from './Main';
import MapView from './MapView';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/map-view" element={<MapView />} />
    </Routes>
  );
}

export default App;

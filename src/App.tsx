import React from 'react';
import './App.css';
import RhodeIslandMap from './components/RhodeIslandMap';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>How Many Rhode Islands?</h1>
        <p>Click two points on the map to measure the distance in Rhode Islands!</p>
      </header>
      <main>
        <RhodeIslandMap />
      </main>
    </div>
  );
}

export default App;

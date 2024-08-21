import { useEffect, useState } from 'react';
import './App.css';
import LiftSimulator from './components/LiftSimulator';

function App() {
  const [floors, setFloors] = useState('');
  const [liftsCount, setLiftsCount] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const floorsParam = queryParams.get('floors');
    const liftsParam = queryParams.get('lifts');

    if (floorsParam && liftsParam) {
      setFloors(parseInt(floorsParam));
      setLiftsCount(parseInt(liftsParam));
      setIsSimulating(true);
    }
  }, []);

  const handleStartSimulation = () => {
    const queryString = `?floors=${floors}&lifts=${liftsCount}`;
    window.history.pushState({}, '', queryString);
    setIsSimulating(true);
  };

  const handleChangeSettings = () => {
    setIsSimulating(false);
    window.history.pushState({}, '', '/');
  };

  return (
    <div>
      {isSimulating ? (
        <div>
          <button onClick={handleChangeSettings} className="change-settings-button">
            Change Settings
          </button>
          <LiftSimulator key={`${floors}-${liftsCount}`} floorsCount={floors} liftsCount={liftsCount} />
        </div>
      ) : (
        <div className="mx-auto form-container">
          <h2>Configure Lift Simulation</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleStartSimulation(); }}>
            <div>
              <label htmlFor="floors">Number of Floors:</label>
              <input
                type="number"
                id="floors"
                value={floors}
                onChange={(e) => setFloors(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="liftsCount">Number of Lifts:</label>
              <input
                type="number"
                id="liftsCount"
                value={liftsCount}
                onChange={(e) => setLiftsCount(e.target.value)}
                required
              />
            </div>
            <button type="submit">Start Simulation</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
import { useState } from 'react';
import './App.css';

function App() {
  const [step, setStep] = useState(0);

  const handleClick = () => {
    if (step < 2) {
      setStep(step + 1);
    }
  };

  return (
    <main>
      <div className="container" onClick={handleClick}>
        <div className={`rose ${step >= 1 ? 'visible' : 'hidden'}`}>
          🌹
        </div>
        <div className={`message ${step >= 2 ? 'visible' : 'hidden'}`}>
          will you be my valentine? gives rose
        </div>
      </div>
    </main>
  );
}

export default App;
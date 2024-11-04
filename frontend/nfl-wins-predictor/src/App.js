import React, { useState } from 'react';

function App() {
  const [values, setValues] = useState({
    QB: 10000000,
    RB: 10000000,
    WR: 10000000,
    TE: 10000000,
    OL: 10000000,
    IDL: 10000000,
    EDGE: 10000000,
    LB: 10000000,
    S: 10000000,
    CB: 10000000
  });
  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: Number(value),
    });
  };

  const handlePredict = async () => {
    const response = await fetch('http://127.0.0.1:5000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ features: Object.values(values) }),
    });
    const data = await response.json();
    setPrediction(data.predicted_wins);
  };

  return (
    <div className="App">
      <h1>NFL Season Wins Predictor</h1>
      {Object.keys(values).map((key) => (
        <div key={key}>
          <label>{key} spending:</label>
          <input
            type="range"
            name={key}
            min="0"
            max="50000000"
            step="1000000"
            value={values[key]}
            onChange={handleChange}
          />
          <span>{values[key]}</span>
        </div>
      ))}
      <button onClick={handlePredict}>Predict Wins</button>
      {prediction !== null && <h2>Predicted Wins: {prediction.toFixed(2)}</h2>}
    </div>
  );
}

export default App;

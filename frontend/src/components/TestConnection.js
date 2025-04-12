import React, { useState, useEffect } from 'react';

function TestConnection() {
  const [message, setMessage] = useState('Connecting...');

  useEffect(() => {
    fetch('/api/test')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then((data) => setMessage(data))
      .catch((error) => setMessage('Error: ' + error.message));
  }, []);

  return (
    <div>
      <h2>Backend Connection Test</h2>
      <p>{message}</p>
    </div>
  );
}

export default TestConnection;
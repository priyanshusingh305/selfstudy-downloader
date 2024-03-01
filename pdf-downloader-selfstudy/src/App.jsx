import React, { useState } from 'react';
import axios from 'axios';
import "./App.css"


const App = () => {
  const [url, setUrl] = useState('');
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let base_url=import.meta.env.VITE_REACT_API_URL
      const response = await axios.get(`${base_url}/?url=${url}`);
      setTableData(response.data);
      setError('');
    } catch (error) {
      setError('Error fetching data from the server');
      setTableData([]);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
 
          Enter URL:
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </label>
        <button type="submit">Fetch Data</button>
      </form>
      {error && <p>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Last Part Without Extension</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((data, index) => (

            <tr key={index}>
              <td>{data[0]}</td>
              <td><a href={data[1]} target="_blank" rel="noopener noreferrer">Download now</a>
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;

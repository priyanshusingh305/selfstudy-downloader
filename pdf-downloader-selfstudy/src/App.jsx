import  { useState } from 'react';
import axios from 'axios';
import "./App.css"


const App = () => {
  const [url, setUrl] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState("");

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
    <>
    <div className='layout'>
    <div className='heading'>
    <h1>Selfstudys PDF Downloader</h1>
    </div>
    <div className='container'>
      <form onSubmit={handleSubmit}>
        <label>
 
          <input
            type="text"
            value={url}
            placeholder='Selfstudys url'
            onChange={(e) => setUrl(e.target.value)}
          />
        </label>
        <button type="submit">Download</button>
      </form>
      {error && <p>{error}</p>}
      {tableData.length === 0 ?(<div></div>):(      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Download</th>
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
      </table>)}

    </div>
    </div>
    </>
  );
};

export default App;

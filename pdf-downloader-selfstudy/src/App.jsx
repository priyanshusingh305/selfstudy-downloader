import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion'; // Import motion and useAnimation from framer-motion
import axios from 'axios';
import "./App.css"

const App = () => {
  const [url, setUrl] = useState("");
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // State to manage loading

  const tableControls = useAnimation(); // Initialize animation controls

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when fetching data starts
    try {
      let base_url=import.meta.env.VITE_REACT_API_URL
      const response = await axios.get(`${base_url}/?url=${url}`);
      setTableData(response.data);
      setError('');
    } catch (error) {
      setError('Error fetching data from the server');
      setTableData([]);
    } finally {
      setLoading(false); // Set loading to false when data fetching ends
    }
  };

  useEffect(() => {
    // Trigger animation when tableData changes
    tableControls.start({
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    });
  }, [tableData, tableControls]);

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
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            tableData.length === 0 ? (
              <div></div>
            ) : (
              <motion.table
                initial={{ opacity: 0, y: -20 }}
                animate={tableControls} // Use animation controls for animating
              >
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Download</th>
                  </tr>
                </thead>
                <motion.tbody>
                  {tableData.map((data, index) => (
                    <motion.tr key={index}>
                      <td>{data[0]}</td>
                      <td>
                        <a className='anchor' href={data[1]} target="_blank" rel="noopener noreferrer">Download</a>
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </motion.table>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default App;

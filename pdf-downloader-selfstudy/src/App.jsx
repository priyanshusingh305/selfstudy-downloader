import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion'; 
import axios from 'axios';
import "./App.css"

const App = () => {
  const [url, setUrl] = useState("");
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [noOutput,setNoOutput]=useState(false)
  const tableControls = useAnimation(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isValidUrl(url)) {
        let base_url = import.meta.env.VITE_REACT_API_URL
        const response = await axios.get(`${base_url}/?url=${url}`);
        setTableData(response.data.sort((a, b) => {
          let numA = parseInt(a[0].split('. ')[0]);
          let numB = parseInt(b[0].split('. ')[0]);
          return numA - numB;
        }));

        if(response.status===200){
        setNoOutput(true)
      }
        setError('');
      } else {
        setError('Please enter a valid URL');
        setTableData([]);
        setNoOutput(false);

      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setError('Resource not found');
        } else {
          setError('Error fetching data from the server / Invalid url');
        }
      } else {
        setError('Network error, please try again later');
      }
      setTableData([]);
      setNoOutput(false)

    } finally {
      setLoading(false);

    }
  };

  const isValidUrl = (url) => {
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlRegex.test(url);
  };

  useEffect(() => {
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
            <button  className='button' type="submit"><span>Download</span></button>
          </form>
          {error && <p>{error}</p>}
          {loading ? (
            <div className="loading"><div className="lds-hourglass"></div></div>
          ) : (
            tableData.length === 0 ? (
              <div>{noOutput && <p>NO OUTPUT</p>}</div>
            ) : (
              <div className='tableContainer'>
                <motion.table
                  initial={{ opacity: 0, y: -20 }}
                  animate={tableControls}
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
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default App;

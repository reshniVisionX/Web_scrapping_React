import './App.css';
import axios from 'axios';
import { useState, useEffect } from 'react';

function App() {
  const [url, setUrl] = useState('');
  const [data, setData] = useState([]);
  const [res, setRes] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/data');
        setData(response.data);
        setUrl('');
        setRes('');
      } catch (error) {
        if (error.response) {
        
          console.error('Server responded with error:', error.response.status);
          setRes('Error fetching data: Server responded with error');
        } else if (error.request) {
        
          console.error('No response received from server:', error.request);
          setRes('Error fetching data: No response received from server');
        } else {
          
          console.error('Error while making request:', error.message);
          setRes(`Error fetching data: ${error.message}`);
        }
      }
    };
  
    fetchData();
  }, [url]); 
  
  const handleChange = (e) => {
    setUrl(e.target.value);
  };

  const makePdf = async () => {
    try {
      const response = await axios.post('/pdf', { url });
      console.log('PDF response:', response); 
      setRes('PDF generated successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      setRes('Error generating PDF');
    }
  };

  const makeHtml = async () => {
    try {
      const response = await axios.post('/html', { url });
      console.log('HTML response:', response); 
      setRes('HTML generated successfully');
    } catch (error) {
      console.error('Error generating HTML:', error);
      setRes('Error generating HTML');
    }
  };

  const makeScreenshot = async () => {
    try {
      const response = await axios.post('/screenshot', { url });
      console.log('Screenshot response:', response); 
      setRes('Screenshot captured successfully');
    } catch (error) {
      console.error('Error generating screenshot:', error);
      setRes('Error generating screenshot');
    }
  };


  return (
    <div className="App">
      <h1>Scrape data from any page</h1>
    
      <input type="text" name="url" placeholder="Enter the url to scrap the content..." value={url} onChange={handleChange} />
      <div className="formats">
        <button type="button" onClick={makePdf}>
          Generate PDF
        </button>
        <button type="button" onClick={makeHtml}>
          Generate HTML
        </button>
        <button type="button" onClick={makeScreenshot}>
          Generate Screenshot
        </button>
      </div>
      {res && <p>{res}</p>} 
      <br /><center>
      <table>
        <thead>
          <tr>
            <th>DateTime</th>
            <th>Format</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          {data.map((datas, index) => (
            <tr key={index}>
              <td>{new Date(datas.createdAt).toLocaleString()}</td>
              <td>{datas.type}</td>
              <td>
               
                <a href={datas.filePath} target="_blank" rel="noreferrer">
                {datas.filePath}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table></center>
    </div>
  );
}

export default App;

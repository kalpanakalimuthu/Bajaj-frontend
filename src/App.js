import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [jsonInput, setJsonInput] = useState(''); // To store user input
  const [apiResponse, setApiResponse] = useState(null); // To store API response
  const [selectedOptions, setSelectedOptions] = useState([]); // To store dropdown selection
  const [error, setError] = useState(''); // To store error messages
  const [file, setFile] = useState(null); // To store the uploaded file
  const [fileBase64, setFileBase64] = useState(''); // To store the file's Base64 string
  const [operationCode, setOperationCode] = useState(''); // To store GET API response

  // Function to handle JSON input change
  const handleInputChange = (event) => {
    setJsonInput(event.target.value);
    setError('');
  };

  // Function to handle file input change
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    // Convert file to Base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setFileBase64(reader.result.split(',')[1]); // Remove the 'data:image/png;base64,' prefix
    };
    reader.readAsDataURL(selectedFile);
  };

  // Function to validate JSON input
  const isValidJSON = (jsonString) => {
    try {
      JSON.parse(jsonString);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate JSON input
    if (!isValidJSON(jsonInput)) {
      setError('Invalid JSON format');
      return;
    }

    // Create the payload with JSON and file in Base64
    const payload = {
      ...JSON.parse(jsonInput),
      file_b64: fileBase64 || null // Add Base64 string to the request if the file is present
    };

    // Call the backend API with valid JSON and file data
    try {
      const response = await axios.post('https://backend-jqtb.onrender.com/bfhl', payload);
      setApiResponse(response.data);
    } catch (err) {
      setError('Error calling the API');
    }
  };

  // Handle dropdown selection
  const handleDropdownChange = (event) => {
    const value = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedOptions(value);
  };

  // Render response based on dropdown selection
  const renderResponse = () => {
    if (!apiResponse) return null;

    let renderedResponse = [];

    if (selectedOptions.includes('Alphabets')) {
      renderedResponse.push(`Alphabets: ${apiResponse.alphabets.join(', ')}`);
    }
    if (selectedOptions.includes('Numbers')) {
      renderedResponse.push(`Numbers: ${apiResponse.numbers.join(', ')}`);
    }
    if (selectedOptions.includes('Highest lowercase alphabet')) {
      renderedResponse.push(`Highest lowercase alphabet: ${apiResponse.highest_lowercase_alphabet.join(', ')}`);
    }

    return (
      <div className="response">
        <h3>Filtered Response:</h3>
        <p>{renderedResponse.join(' | ')}</p>
      </div>
    );
  };

  const handleGetOperationCode = async () => {
    try {
      const response = await axios.get('https://backend-jqtb.onrender.com/bfhl');
      setOperationCode(response.data.operation_code);
    } catch (err) {
      setError('Error fetching the operation code');
    }
  };


  return (
    <div className="App">
      <h1>Dynamic Frontend & Smart API for JSON and File Handling</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Enter JSON:
          <textarea
            value={jsonInput}
            onChange={handleInputChange}
            rows="5"
            cols="50"
            placeholder='{"data": ["A", "C", "z"]}'
          />
        </label>


        {/* File input */}

        <div className="file-upload-container">
          <label>
            Upload File:
            <input type="file" onChange={handleFileChange} accept="image/*" />
          </label>
        </div>
        <br />

        <button type="submit">Submit</button>
      </form>

      {error && <p className="error">{error}</p>}

      {apiResponse && (
        <>
          <h4>Select Options:</h4>
          <select multiple={true} onChange={handleDropdownChange}>
            <option value="Alphabets">Alphabets</option>
            <option value="Numbers">Numbers</option>
            <option value="Highest lowercase alphabet">Highest lowercase alphabet</option>
          </select>

          {selectedOptions.length > 0 && renderResponse()}

          {selectedOptions.length > 0 &&
            <button onClick={handleGetOperationCode}>GET</button>
          }
           {operationCode && (
            <ul>
              <li>Operation Code: {operationCode}</li>
            </ul>
          )}

        </>
      )}
    </div>
  );
}

export default App;



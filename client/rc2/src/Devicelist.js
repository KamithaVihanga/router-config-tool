import React, { useState } from "react";
import axios from "axios";

function App() {
  const [selectedDevice, setSelectedDevice] = useState("cisco");
  const [selectedModel, setSelectedModel] = useState("C1");
  const [logText, setLogText] = useState("");
  const [jobNumber, setJobNumber] = useState("");
  const [customer, setCustomer] = useState("");
  const [location, setLocation] = useState("");
  

  const handleDeviceChange = (e) => {
    setSelectedDevice(e.target.value);
    if (e.target.value === "cisco") {
      setSelectedModel("C1");
    } else if (e.target.value === "huawei") {
      setSelectedModel("H1");
    }
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const handleScriptButtonClick = () => {
    setLogText(
      `Selected Device: ${selectedDevice}, Selected Model: ${selectedModel}`
    );
  };

  const handlePushButtonClick = () => {
    console.log(logText);
  };

  axios.defaults.baseURL = 'http://localhost:3001';


  const handleSearch = () => {
    if (selectedModel === 'H1') {
      runH1Function();
    } else if (selectedModel === 'C1') {
      runC1Function();
    }
    else {
      setLogText(" ");
    }
  }
  
  const runH1Function = () => {
    setLogText(
      `Selected Device: ${selectedDevice}, Selected Model: ${selectedModel}`
    );
    // code to retrieve the record from the database using the jobNumber variable
    // assuming you're using a library like Axios to make the API call:
    axios.get(`api/records/${jobNumber}`).then((response) => {
      const { customer, location } = response.data;
      setCustomer(customer);
      setLocation(location);
      console.log("success"+customer+" "+location);
      setLogText(
        `This is H1 \n Selected Device: ${selectedDevice}, \n Selected Model: ${selectedModel}, \n customer: ${customer}, \n location: ${location}`
      );
    }).catch((error) => {
      console.log(error);
      
    });
  }
  
  const runC1Function = () => {
    // code to retrieve the record from the database using the jobNumber variable
    // assuming you're using a library like Axios to make the API call:
    axios.get(`api/records/${jobNumber}`).then((response) => {
      const { customer, location } = response.data;
      setCustomer(customer);
      setLocation(location);
      console.log("success"+customer+" "+location);
      setLogText(
        `This is C1 \n Selected Device: ${selectedDevice}, \n Selected Model: ${selectedModel}, \n customer: ${customer}, \n location: ${location}`
      );
    }).catch((error) => {
      console.log(error);
      
    });
  }
  
  

  return (
    <div>
      <label>Device:</label>
      <select value={selectedDevice} onChange={handleDeviceChange}>
        <option value="cisco">Cisco</option>
        <option value="huawei">Huawei</option>
      </select>
      <br />
      <label>Model:</label>
      <select value={selectedModel} onChange={handleModelChange}>
        {selectedDevice === "cisco" && (
          <>
            <option value="C1">C1</option>
            <option value="C2">C2</option>
          </>
        )}
        {selectedDevice === "huawei" && (
          <>
            <option value="H1">H1</option>
            <option value="H2">H2</option>
          </>
        )}
      </select>
      <br />

      <div>
        <label htmlFor="jobNumber">Job Number:</label>
        <input
          type="text"
          id="jobNumber"
          value={jobNumber}
          onChange={(e) => setJobNumber(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <br />
      <button onClick={handleScriptButtonClick}>Script</button>
      <button onClick={handlePushButtonClick}>Push</button>
      <br />
      <textarea value={logText} readOnly />
    </div>
  );
}

export default App;

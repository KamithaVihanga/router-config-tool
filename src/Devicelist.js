import React, { useState } from "react";
import axios from "axios";
import "./styles.css";

import writeToSerialPort from "./Pushscript";
import PushScript from "./Pushscript2";
import genH1 from "./ScriptGen/H1";

function App() {
  const [selectedDevice, setSelectedDevice] = useState("cisco");
  const [selectedModel, setSelectedModel] = useState("C1");
  const [logText, setLogText] = useState("");
  const [jobNumber, setJobNumber] = useState("");
  const [customer, setCustomer] = useState("");
  const [router, setRouter] = useState("");
  const [location, setLocation] = useState("");
  const [hostname, setHostname] = useState("");
  

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
    //PushScript.pushScriptToRouter(logText);
    PushScript(logText);
    console.log(logText);
  };

  axios.defaults.baseURL = "http://localhost:3001";

  const handleSearch = () => {
    if (selectedModel === "H1") {
      runH1Function();
    } else if (selectedModel === "C1") {
      runC1Function();
    } else {
      setLogText(" ");
    }
  };
  //******************************************************* */
  const runH1Function = () => {
    // code to retrieve the record from the database using the jobNumber variable
    // assuming you're using a library like Axios to make the API call:
    axios
      .get(`api/records/${jobNumber}`)
      .then((response) => {
        const { customer, router, location, hostname } = response.data;
        setCustomer(customer);
        setRouter(router);
        setLocation(location);
        setHostname(hostname);
        console.log("success" + customer + " " + location + " " + response);

        setLogText(genH1(response.data));
      })
      .catch((error) => {
        setLogText("");
        if (error.message === "Network Error") {
          window.alert("Lost db connection ");
        } else if (error.response.status === 404) {
          window.alert("No record found");
          console.log(error);
        } else if (error.response.status === 505) {
          window.alert("Failed to retrieve the record from the database");
          console.log(error);
        } else {
          window.alert(error);
        }
      });
  };

  //******************************************************* */

  const runC1Function = () => {
    // code to retrieve the record from the database using the jobNumber variable
    // assuming you're using a library like Axios to make the API call:
    axios
      .get(`api/records/${jobNumber}`)
      .then((response) => {
        const { customer, location } = response.data;
        setCustomer(customer);
        setLocation(location);
        console.log("success" + customer + " " + location);
        setLogText(
          `This is C1 \n Selected Device: ${selectedDevice}, \n Selected Model: ${selectedModel}, \n customer: ${customer}, \n location: ${location}`
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="wrapper">
      <div className="button-container">
        <a href="/terminal/index.html">
          <img
            src="terminal.png"
            alt="Terminal Button"
            className="btn-topright"
            width="20"
            height="20"
          />
        </a>

        <div className="title">Router Config Tool</div>

        <div className="form">
          <br />
          <div>
            {/* <button id="send" disabled>
              Send
            </button> */}
            <button id="clear" disabled>
              Clear
            </button>
          </div>
          <div>
            <button className="btn" id="openclose_port">Open</button>
          </div>

          <br />
          <div className="inputfield">
            <label>Device:</label>
            <div className="custom_select">
              <select value={selectedDevice} onChange={handleDeviceChange}>
                <option value="cisco">Cisco</option>
                <option value="huawei">Huawei</option>
              </select>
            </div>
            <br />
          </div>

          <div className="inputfield">
            <label>Model:</label>
            <div className="custom_select">
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
            </div>
            <br />
          </div>
          <div className="inputfield">
            <label htmlFor="jobNumber">Job Number:</label>
            <input
              className="input"
              type="text"
              id="jobNumber"
              value={jobNumber}
              onChange={(e) => setJobNumber(e.target.value)}
            />
          </div>

          <button className="btn" onClick={handleSearch}>
            Search
          </button>

          <br />
          <br />

          <div>
            <button className="btn" onClick={handleScriptButtonClick}>
              Script
            </button>
          </div>
          <br />

          <br />
          <textarea
            className="textarea"
            id="textarea"
            value={logText}
            onChange={(e) => setLogText(e.target.value)}
          />
          <br />
          <br />
          <div>
            {/* <button className="pbtn" id="push" onClick={handlePushButtonClick}>
              Push
            </button> */}
            <button className="pbtn" id="send" disabled>
              Send
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

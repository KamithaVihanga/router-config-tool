let portOpen = false; // tracks whether a port is corrently open
let portPromise; // promise used to wait until port succesfully closed
let holdPort = null; // use this to park a SerialPort object when we change settings so that we don't need to ask the user to select it again
let port; // current SerialPort object
let reader; // current port reader object so we can call .cancel() on it to interrupt port reading

// Do these things when the window is done loading
window.onload = function () {
  // Check to make sure we can actually do serial stuff
  if ("serial" in navigator) {
    // The Web Serial API is supported.
    console.log("Awesome, The serial port is supported.");
    // Connect event listeners to DOM elements
    document
      .getElementById("openclose_port")
      .addEventListener("click", openClose);
    //document.getElementById("change").addEventListener("click", changeSettings);
    //document.getElementById("clear").addEventListener("click", clearTerminal);
    document.getElementById("send").addEventListener("click", sendString);
    //document.getElementById("term_input").addEventListener("keydown", detectEnter);

    // Clear the term_window textarea
    //clearTerminal();

    // See if there's a prefill query string on the URL
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    // Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
    let preFill = params.prefill; // "some_value"
    if (preFill != null) {
      // If there's a prefill string then pop it into the term_input textarea
      document.getElementById("term_input").value = preFill;
    }
  } else {
    // The Web Serial API is not supported.
    // Warn the user that their browser won't do stupid serial tricks
    alert("The Web Serial API is not supported by your browser");
  }
};

async function openClose() {
  // Is there a port open already?
  if (portOpen) {
    // Port's open. Call reader.cancel() forces reader.read() to return done=true
    // so that the read loop will break and close the port
    reader.cancel();
    console.log("attempt to close");
  } else {
    console.log("start");
    port = await navigator.serial.requestPort();

    document.getElementById("term_window").value = ""; // make term_window textarea empty

    // Open the serial port
    await port.open({
      baudRate: 9600,
      dataBits: 8,
      parity: "none",
      stopBits: 1,
    });

    // Create a textDecoder stream and get its reader, pipe the port reader to it
    const textDecoder = new TextDecoderStream();
    reader = textDecoder.readable.getReader();
    const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);

    portOpen = true;
    document.getElementById("openclose_port").innerText = "Close";
    //document.getElementById("term_input").disabled = false;
    document.getElementById("send").disabled = false;
    //document.getElementById("clear").disabled = false;
    //document.getElementById("change").disabled = false;

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        reader.releaseLock(); // release the lock on the reader so the owner port can be closed
        document.getElementById("term_window").value += "***END****";
        break;
      }
      document.getElementById("term_window").value += value; // write the incoming string to the term_window textarea
      console.log(value);
    }
    await readableStreamClosed.catch(() => {
      /* Ignore the error */
    });
    await port.close();

    console.log("port closed");
    document.getElementById("openclose_port").innerText = "Open";
    // document.getElementById("term_input").disabled = true;
    document.getElementById("send").disabled = true;
    //document.getElementById("change").disabled = true;
    //document.getElementById("port_info").innerText = "Disconnected";

    portOpen = false;
    document.getElementById("openclose_port").innerText = "Open";
  }
}

async function sendString() {
  console.log("send");
  let outString = document.getElementById("term_input").value; // get the string to send from the term_input textarea
  console.log("x:"+outString);
  //document.getElementById("term_input").value = ""; // clear the term_input textarea for the next user input

  const writer = port.writable.getWriter();

  const encoder = new TextEncoder();
  //const start = " \r";
  //await writer.write(encoder.encode(start));

  const enable = outString + "\r";
  await writer.write(encoder.encode(enable));

  // write the outString to the writer
  //await writer.write(outString);
  // add the outgoing string to the term_window textarea on its own new line denoted by a ">"
  document.getElementById("term_window").value += "\n>" + outString + "\n";

  // close the writer since we're done sending for now
  writer.close();
  //await writableStreamClosed;



}

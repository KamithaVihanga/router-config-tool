async function writeToSerialPort() {
  const logText = document.getElementById("textarea").value;
  console.log(logText);

  try {
    // Request permission to use the serial port
    const port = await navigator.serial.requestPort();

    // Check if the port is already open
    if (port.readable || port.writable) {
      // If the port is already open, show a popup alert with a close button
      const result = window.confirm(
        "The port is already open. Do you want to close it?"
      );
      if (result) {
        await port.close();
      } else {
        return;
      }
    }

    // Connect to the selected port
    await port.open({ baudRate: 9600 });

    // Convert the text string to a Uint8Array
    const encoder = new TextEncoder();
    const data = encoder.encode(logText);

    const writer = port.writable.getWriter();
    




    // const reader = port.readable.getReader();
    // while (true) {
    //   const { value, done } = await reader.read();
    //   if (done) {
    //     // Allow the serial port to be closed later.
    //     console.log("sss");
    //     reader.releaseLock();
    //     break;
    //   }
    //   // value is a Uint8Array.
    //   console.log(value);
    //   console.log("ddd");
    // }
    // reader.cancel();




    // Write data to the port
    //await port.write(data);
    //const { value, done } = await reader.read();
    //const { value, done }=await writer.write(data);
    
    await writer.write(data)
    await writer.write(data);
    //console.log(done);

    writer.releaseLock(); // release the lock on the reader so the owner port can be closed
    // close the writer since we're done sending for now
    //writer.close();

    // Close the port
    await port.close();
    // Show a popup alert when the write operation is completed
    window.alert("Done");
  } catch (err) {
    if (err instanceof DOMException) {
      // Show a popup alert if the user hasn't selected a port
      window.alert("You need to select a serial port to use.");
    } else {
      console.error(err);
    }
  }
}

export default writeToSerialPort;

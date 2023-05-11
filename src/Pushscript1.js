
// In pushscript.js
const PushScript = {


    
  pushScriptToRouter: async (script) => {
    const port = await navigator.serial.requestPort();
    await port.open({ baudrate: 9600 });
    const writer = port.writable.getWriter();
    await writer.write(script);
    await writer.close();
  },
};

export default PushScript;

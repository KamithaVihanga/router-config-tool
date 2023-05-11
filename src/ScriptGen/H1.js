function genH1(data) {
    const  { customer, router, location,hostname } = data;
    return (
     
        `#
sysname ${hostname}
#
header login information "
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
${location !== "" ? `location is x ${location}` : ""}
${location !== "AMBALANGODA" ? `location is y ${location}` : ""}

        `
        
     
    );
  }
  
  export default genH1;
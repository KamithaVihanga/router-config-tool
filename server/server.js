const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

// 0994909918

const app = express();
// Enable CORS
app.use(cors());

const port = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'abcd1234',
  database: 'IPNO_VPN'
});

connection.connect((error) => {
  if (error) {
    console.log('Failed to connect to the database:', error);
    return;
  }

  console.log('Connected to the database!');
});

app.get('/api/records/:jobNumber', (req, res) => {
  const jobNumber = req.params.jobNumber;
  const query = `SELECT customer,location FROM COMPLETE_DETAILS WHERE job_no = ${jobNumber}`;

  connection.query(query, (error, results) => {
    if (error) {
      console.log('Failed to retrieve the record from the database:', error);
      res.status(500).send('Failed to retrieve the record from the database.');
      return;
    }

    if (results.length === 0) {
      console.log(`No record found for job number ${jobNumber}.`);
      res.status(404).send(`No record found for job number ${jobNumber}.`);
      return;
    }

    const record = results[0];
    res.status(200).json({
      customer: record.customer,
      location: record.location,
      
    });
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});

const dotenv = require('dotenv');
dotenv.config();

const mysql = require('mysql');

const pool = mysql.createPool({
  host: "139.59.5.171",
  user: "tested",
  password: "ZSzJhM8Lx57gQciWiBZCu",
  database: "e_com",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Add an event listener for errors in the pool
pool.on('error', (err) => {
  console.error('MySQL Pool Error:', err.message);

  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('Database connection was closed.');
  }
  if (err.code === 'ER_CON_COUNT_ERROR') {
    console.error('Database has too many connections.');
  }
  if (err.code === 'ECONNREFUSED') {
    console.error('Database connection was refused.');
  }

  // Optionally, you can add logic here to attempt reconnection or take other actions.
});

// Attempt to establish a connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    return;
  }

  console.log('Connected to MySQL database successfully.');

  // Release the connection back to the pool when done using it
  connection.release();
});

module.exports = pool;

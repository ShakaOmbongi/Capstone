const { Client } = require('pg'); // Import PostgreSQL client

// PostgreSQL configuration
const client = new Client({
    host: 'localhost',      // PostgreSQL server host
    port: 5432,             // PostgreSQL default port
    user: 'postgres',       // PostgreSQL username
    password: 'qwe123', // Replace with your actual password
    database: 'PeerAId'     // Database name
});

// Connect to the database
client.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Connection error:', err.stack));

module.exports = client; // Export the client for use in other files

require('dotenv').config(); // Load environment variables from .env

const express = require('express'); // Import Express
const client = require('./db');    // Import PostgreSQL connection

const app = express();
const PORT = process.env.PORT || 3000; // Use PORT from .env or default to 3000

// Middleware to parse incoming JSON data
app.use(express.json());

// Home route
app.get('/', (req, res) => {
    res.send('Welcome to the Peeraid app!');
});

// Route to get all users
app.get('/users', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM users');
        res.json(result.rows); // Send users as a JSON response
    } catch (err) {
        res.status(500).send('Error retrieving users');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

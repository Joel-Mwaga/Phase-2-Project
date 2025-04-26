const express = require('express');
const cors = require('cors');
const path = require('path');

let jsonServer;
try {
    jsonServer = require('json-server');
    console.log('json-server module loaded successfully');
} catch (err) {
    console.error('Error loading json-server:', err.message);
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Use json-server to serve db.json
if (jsonServer) {
    const router = jsonServer.router('db.json'); // Path to your db.json file
    app.use('/api', router); // Serve json-server on the /api route
}

// Catch-all route to serve the React app
app.get('*', (req, res) => {
    const filePath = path.join(__dirname, 'build', 'index.html');
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error(`Error serving file: ${err.message}`);
            res.status(500).send('Internal Server Error');
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
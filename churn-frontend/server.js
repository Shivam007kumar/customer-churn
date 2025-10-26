const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 8080; // The port our Node.js server will run on

// Middleware
app.use(cors()); // Allow requests from our React app
app.use(express.json()); // Allow the server to read JSON bodies

// --- THIS IS THE MOST IMPORTANT PART ---
// The URL of your deployed AWS App Runner API
// Replace this with your actual URL once it's live!
const API_GATEWAY_URL = 'https://biutmmjpd7.us-east-1.awsapprunner.com/predict';

// Define a proxy endpoint
app.post('/api/predict', async (req, res) => {
  try {
    console.log('Received request from frontend:', req.body);

    // Forward the request from the frontend to the AWS ML API
    const response = await axios.post(API_GATEWAY_URL, req.body);

    console.log('Received response from AWS API:', response.data);
    
    // Send the response from the AWS API back to the frontend
    res.json(response.data);

  } catch (error) {
    console.error('Error calling AWS API:', error.message);
    res.status(500).json({ error: 'Failed to get prediction' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
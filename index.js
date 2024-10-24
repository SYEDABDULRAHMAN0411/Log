import express from 'express'; 
import cors from 'cors'; 

const app = express();
const PORT = process.env.X_ZOHO_CATALYST_LISTEN_PORT || 3001;

// Middleware
app.use(cors());

// Simulated log data structure
const logLevels = ['INFO', 'DEBUG', 'WARN', 'ERROR'];
const httpMethods = ['GET', 'POST', 'PUT', 'DELETE'];
const urls = ['/ready', '/status', '/api/data', '/login'];
const clients = ['curl/7.87.0', 'Go-http-client/2.0', 'PostmanRuntime/7.29.0'];
let logId = 0;
let messageSent = false; // A flag to send the message once

// Endpoint to stream logs
app.get('/logs/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const sendLog = () => {
        // If message has not been sent, send the service message first
        if (!messageSent) {
            const serviceMessage = {
                type: 'service-status',
                message: "✅ Your service is live 🚀", // Custom message to indicate service status
                timestamp: new Date().toISOString()
            };
            res.write(`data: ${JSON.stringify(serviceMessage)}\n\n`);
            messageSent = true; // Flag to prevent the message from being sent again
            return;
        }

        // Regular log messages
        const logEntry = {
            timestamp: new Date().toISOString(),
            level: logLevels[Math.floor(Math.random() * logLevels.length)],
            method: httpMethods[Math.floor(Math.random() * httpMethods.length)],
            url: urls[Math.floor(Math.random() * urls.length)],
            client: clients[Math.floor(Math.random() * clients.length)],
            responseTime: (Math.random() * 1).toFixed(6), // Simulated response time
            bytes: Math.floor(Math.random() * 500), // Simulated bytes transferred
            statusCode: [200, 404, 500][Math.floor(Math.random() * 3)] // Simulated status codes
        };

        res.write(`data: ${JSON.stringify(logEntry)}\n\n`);
    };

    // Send a log every 2 seconds
    const intervalId = setInterval(sendLog, 2000);

    // Close connection on client disconnect
    req.on('close', () => {
        clearInterval(intervalId);
        res.end();
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

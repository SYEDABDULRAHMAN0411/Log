import express from 'express'; // ES module syntax
import cors from 'cors'; // Use import instead of require

const app = express();
const PORT = process.env.X_ZOHO_CATALYST_LISTEN_PORT || 3001;

// Middleware
app.use(cors());

// Simulated log messages
const logLevels = ['INFO', 'DEBUG', 'WARN', 'ERROR'];
let logId = 0;

// Endpoint to stream logs
app.get('/logs/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const sendLog = () => {
        const logEntry = {
            timestamp: Math.floor(Date.now() / 1000), // Current timestamp in seconds
            level: logLevels[Math.floor(Math.random() * logLevels.length)],
            log: `Sample log message #${logId++}`,
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

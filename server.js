const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Function to get client IP
function getClientIP(req) {
    return req.headers['x-forwarded-for'] || 
           req.headers['x-real-ip'] ||
           req.connection.remoteAddress || 
           req.socket.remoteAddress ||
           (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
           req.ip;
}

// API route to get IP and location information
app.get('/api/ip-info', async (req, res) => {
    try {
        let clientIP = getClientIP(req);
        
        // Handle localhost/development environment
        if (clientIP === '::1' || clientIP === '127.0.0.1' || clientIP?.includes('::ffff:127.0.0.1')) {
            // For testing, we'll use a public IP service to get the real public IP
            try {
                const ipResponse = await axios.get('https://api.ipify.org?format=json', { timeout: 5000 });
                clientIP = ipResponse.data.ip;
            } catch (error) {
                // Fallback to a demo IP if we can't get the real one
                clientIP = '8.8.8.8';
            }
        }

        // Get location information using ip-api.com (free service)
        const locationResponse = await axios.get(`http://ip-api.com/json/${clientIP}`, { 
            timeout: 5000 
        });

        const locationData = locationResponse.data;

        // Prepare response
        const ipInfo = {
            ip: clientIP,
            success: locationData.status === 'success',
            country: locationData.country || 'Unknown',
            countryCode: locationData.countryCode || 'Unknown',
            region: locationData.region || 'Unknown',
            regionName: locationData.regionName || 'Unknown',
            city: locationData.city || 'Unknown',
            zip: locationData.zip || 'Unknown',
            lat: locationData.lat || null,
            lon: locationData.lon || null,
            timezone: locationData.timezone || 'Unknown',
            isp: locationData.isp || 'Unknown',
            org: locationData.org || 'Unknown',
            as: locationData.as || 'Unknown',
            query: locationData.query || clientIP
        };

        res.json(ipInfo);
    } catch (error) {
        console.error('Error fetching IP information:', error.message);
        res.status(500).json({
            error: 'Failed to fetch IP information',
            ip: getClientIP(req) || 'Unknown',
            success: false
        });
    }
});

// API route to get IP information for a specific IP address
app.get('/api/lookup/:ip', async (req, res) => {
    try {
        const targetIP = req.params.ip;
        
        // Basic IP validation
        const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (!ipRegex.test(targetIP)) {
            return res.status(400).json({
                error: 'Invalid IP address format',
                success: false
            });
        }

        // Get location information
        const locationResponse = await axios.get(`http://ip-api.com/json/${targetIP}`, { 
            timeout: 5000 
        });

        const locationData = locationResponse.data;

        const ipInfo = {
            ip: targetIP,
            success: locationData.status === 'success',
            country: locationData.country || 'Unknown',
            countryCode: locationData.countryCode || 'Unknown',
            region: locationData.region || 'Unknown',
            regionName: locationData.regionName || 'Unknown',
            city: locationData.city || 'Unknown',
            zip: locationData.zip || 'Unknown',
            lat: locationData.lat || null,
            lon: locationData.lon || null,
            timezone: locationData.timezone || 'Unknown',
            isp: locationData.isp || 'Unknown',
            org: locationData.org || 'Unknown',
            as: locationData.as || 'Unknown',
            query: locationData.query || targetIP
        };

        res.json(ipInfo);
    } catch (error) {
        console.error('Error fetching IP information:', error.message);
        res.status(500).json({
            error: 'Failed to fetch IP information',
            success: false
        });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`🌐 IP Lookup Server running on http://localhost:${PORT}`);
    console.log(`📡 API endpoints:`);
    console.log(`   GET /api/ip-info - Get your IP and location`);
    console.log(`   GET /api/lookup/:ip - Lookup specific IP address`);
});

module.exports = app;

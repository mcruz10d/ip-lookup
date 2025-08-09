const axios = require('axios');

// Function to get client IP
function getClientIP(req) {
    return req.headers['x-forwarded-for'] || 
           req.headers['x-real-ip'] ||
           req.connection?.remoteAddress || 
           req.socket?.remoteAddress ||
           (req.connection?.socket ? req.connection.socket.remoteAddress : null) ||
           req.ip;
}

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

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

        // Get location information using ip-api.com (using HTTPS)
        const locationResponse = await axios.get(`https://ip-api.com/json/${clientIP}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`, { 
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
        console.error('Full error:', error);
        res.status(500).json({
            error: 'Failed to fetch IP information',
            details: error.message,
            ip: getClientIP(req) || 'Unknown',
            success: false
        });
    }
};

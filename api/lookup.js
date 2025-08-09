const axios = require('axios');

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
        // Get IP from query parameter
        const targetIP = req.query.ip;
        
        if (!targetIP) {
            return res.status(400).json({
                error: 'IP parameter is required',
                success: false
            });
        }
        
        // Basic IP validation
        const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (!ipRegex.test(targetIP)) {
            return res.status(400).json({
                error: 'Invalid IP address format',
                success: false
            });
        }

        // Get location information using HTTPS
        const locationResponse = await axios.get(`https://ip-api.com/json/${targetIP}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`, { 
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
};

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

        // Try multiple geolocation services as fallbacks
        let locationData = null;
        let service = 'unknown';
        
        // First try: ipapi.co (free, reliable)
        try {
            console.log('Trying ipapi.co...');
            const response = await axios.get(`https://ipapi.co/${targetIP}/json/`, { 
                timeout: 5000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; IP-Lookup-App/1.0)'
                }
            });
            
            if (response.data && !response.data.error) {
                const data = response.data;
                locationData = {
                    status: 'success',
                    country: data.country_name,
                    countryCode: data.country_code,
                    region: data.region_code,
                    regionName: data.region,
                    city: data.city,
                    zip: data.postal,
                    lat: data.latitude,
                    lon: data.longitude,
                    timezone: data.timezone,
                    isp: data.org,
                    org: data.org,
                    as: data.asn,
                    query: targetIP
                };
                service = 'ipapi.co';
                console.log('ipapi.co successful');
            }
        } catch (error) {
            console.log('ipapi.co failed:', error.message);
        }
        
        // Second try: ip-api.com with different approach
        if (!locationData) {
            try {
                console.log('Trying ip-api.com...');
                const response = await axios.get(`http://ip-api.com/json/${targetIP}`, { 
                    timeout: 5000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (compatible; IP-Lookup-App/1.0)'
                    }
                });
                
                if (response.data && response.data.status === 'success') {
                    locationData = response.data;
                    service = 'ip-api.com';
                    console.log('ip-api.com successful');
                }
            } catch (error) {
                console.log('ip-api.com failed:', error.message);
            }
        }
        
        // Third try: ipinfo.io (free tier)
        if (!locationData) {
            try {
                console.log('Trying ipinfo.io...');
                const response = await axios.get(`https://ipinfo.io/${targetIP}/json`, { 
                    timeout: 5000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (compatible; IP-Lookup-App/1.0)'
                    }
                });
                
                if (response.data && !response.data.error) {
                    const data = response.data;
                    const [lat, lon] = (data.loc || '0,0').split(',');
                    locationData = {
                        status: 'success',
                        country: data.country,
                        countryCode: data.country,
                        region: data.region,
                        regionName: data.region,
                        city: data.city,
                        zip: data.postal,
                        lat: parseFloat(lat) || null,
                        lon: parseFloat(lon) || null,
                        timezone: data.timezone,
                        isp: data.org,
                        org: data.org,
                        as: data.org,
                        query: targetIP
                    };
                    service = 'ipinfo.io';
                    console.log('ipinfo.io successful');
                }
            } catch (error) {
                console.log('ipinfo.io failed:', error.message);
            }
        }
        
        if (!locationData) {
            throw new Error('All geolocation services failed');
        }

        const ipInfo = {
            ip: targetIP,
            success: true,
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
            query: locationData.query || targetIP,
            service: service
        };

        res.json(ipInfo);
    } catch (error) {
        console.error('Error fetching IP information:', error.message);
        console.error('Full error:', error);
        res.status(500).json({
            error: 'Failed to fetch IP information',
            details: error.message,
            success: false
        });
    }
};

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
        // Get server from query parameter or use default
        const server = req.query.server || 'play.bdzonemc.com'; // Default server
        
        console.log(`Checking Minecraft server status for: ${server}`);
        
        // Try multiple Minecraft status APIs as fallbacks
        let serverData = null;
        let service = 'unknown';
        
        // First try: mcsrvstat.us (reliable and free)
        try {
            console.log('Trying mcsrvstat.us...');
            const response = await axios.get(`https://api.mcsrvstat.us/2/${server}`, { 
                timeout: 10000 
            });
            
            if (response.data) {
                const data = response.data;
                serverData = {
                    online: data.online || false,
                    players: {
                        online: data.players?.online || 0,
                        max: data.players?.max || 0
                    },
                    version: data.version || 'Unknown',
                    motd: data.motd?.clean ? data.motd.clean.join(' ') : 'BDZONE Minecraft Server',
                    icon: data.icon || null,
                    hostname: data.hostname || server,
                    port: data.port || 25565,
                    software: data.software || 'Minecraft'
                };
                service = 'mcsrvstat.us';
                console.log('mcsrvstat.us successful');
            }
        } catch (error) {
            console.log('mcsrvstat.us failed:', error.message);
        }
        
        // Second try: mcapi.us
        if (!serverData) {
            try {
                console.log('Trying mcapi.us...');
                const response = await axios.get(`https://mcapi.us/server/status?ip=${server}`, { 
                    timeout: 10000 
                });
                
                if (response.data) {
                    const data = response.data;
                    serverData = {
                        online: data.online || false,
                        players: {
                            online: data.players?.now || 0,
                            max: data.players?.max || 0
                        },
                        version: data.server?.name || 'Unknown',
                        motd: data.motd || 'BDZONE Minecraft Server',
                        icon: null,
                        hostname: server,
                        port: 25565,
                        software: 'Minecraft'
                    };
                    service = 'mcapi.us';
                    console.log('mcapi.us successful');
                }
            } catch (error) {
                console.log('mcapi.us failed:', error.message);
            }
        }
        
        // Fallback: Return offline status if all APIs fail
        if (!serverData) {
            console.log('All Minecraft status APIs failed, returning offline status');
            serverData = {
                online: false,
                players: {
                    online: 0,
                    max: 0
                },
                version: 'Unknown',
                motd: 'BDZONE Minecraft Server',
                icon: null,
                hostname: server,
                port: 25565,
                software: 'Minecraft',
                error: 'Unable to connect to server'
            };
            service = 'fallback';
        }
        
        const response = {
            success: true,
            server: server,
            status: serverData,
            service: service,
            timestamp: new Date().toISOString()
        };
        
        console.log('Minecraft status response:', JSON.stringify(response, null, 2));
        res.json(response);
        
    } catch (error) {
        console.error('Error fetching Minecraft server status:', error.message);
        console.error('Full error:', error);
        
        res.status(500).json({
            success: false,
            error: 'Failed to fetch server status',
            details: error.message,
            server: req.query.server || 'bdzone.net',
            timestamp: new Date().toISOString()
        });
    }
};

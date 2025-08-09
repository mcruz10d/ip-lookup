// Modern Minimalist IP Lookup
class IPLookup {
    constructor() {
        this.isLoading = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.autoDetectOnLoad();
        this.initMinecraftStatus();
    }

    bindEvents() {
        const detectBtn = document.getElementById('detectBtn');
        const lookupBtn = document.getElementById('lookupBtn');
        const ipInput = document.getElementById('ipInput');

        detectBtn.addEventListener('click', () => this.detectCurrentIP());
        lookupBtn.addEventListener('click', () => this.lookupIP());
        
        // Enhanced keyboard interactions
        ipInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.isLoading) {
                this.lookupIP();
            }
        });

        // Real-time input validation with visual feedback
        ipInput.addEventListener('input', (e) => this.validateIPInput(e.target));
        ipInput.addEventListener('paste', (e) => {
            setTimeout(() => this.validateIPInput(e.target), 0);
        });
    }

    autoDetectOnLoad() {
        // Test API first, then auto-detect after a brief delay for better UX
        setTimeout(async () => {
            try {
                console.log('Testing API connectivity...');
                const testResponse = await fetch('/api/test');
                const testData = await testResponse.json();
                console.log('API test successful:', testData);
            } catch (error) {
                console.error('API test failed:', error);
            }
            this.detectCurrentIP();
        }, 500);
    }

    async detectCurrentIP() {
        if (this.isLoading) return;
        
        const button = document.getElementById('detectBtn');
        const resultContainer = document.getElementById('currentIpResult');
        
        try {
            this.isLoading = true;
            this.setButtonLoading(button, true);
            this.showGlobalLoading(true);
            
            console.log('Fetching from /api/ip-info...');
            const response = await fetch('/api/ip-info');
            console.log('Response status:', response.status, response.statusText);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));
            const data = await response.json();
            console.log('Response data:', data);
            
            if (response.ok) {
                this.displayResult(resultContainer, data);
            } else {
                this.displayError(resultContainer, data.error || 'Failed to detect IP');
            }
        } catch (error) {
            console.error('Error detecting IP:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            this.displayError(resultContainer, `Network error: ${error.message}. Please try again.`);
        } finally {
            this.isLoading = false;
            this.setButtonLoading(button, false);
            this.showGlobalLoading(false);
        }
    }

    async lookupIP() {
        if (this.isLoading) return;
        
        const ipInput = document.getElementById('ipInput');
        const lookupBtn = document.getElementById('lookupBtn');
        const resultContainer = document.getElementById('lookupResult');
        const ip = ipInput.value.trim();

        if (!ip) {
            this.displayError(resultContainer, 'Please enter an IP address');
            ipInput.focus();
            return;
        }

        if (!this.isValidIP(ip)) {
            this.displayError(resultContainer, 'Please enter a valid IP address');
            ipInput.focus();
            return;
        }

        try {
            this.isLoading = true;
            this.setButtonLoading(lookupBtn, true);
            this.showGlobalLoading(true);
            
            console.log(`Fetching from /api/lookup?ip=${ip}...`);
            const response = await fetch(`/api/lookup?ip=${ip}`);
            console.log('Response status:', response.status, response.statusText);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));
            const data = await response.json();
            console.log('Response data:', data);
            
            if (response.ok) {
                this.displayResult(resultContainer, data);
            } else {
                this.displayError(resultContainer, data.error || 'Failed to lookup IP');
            }
        } catch (error) {
            console.error('Error looking up IP:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            this.displayError(resultContainer, `Network error: ${error.message}. Please try again.`);
        } finally {
            this.isLoading = false;
            this.setButtonLoading(lookupBtn, false);
            this.showGlobalLoading(false);
        }
    }

    displayResult(container, data) {
        const flagEmoji = this.getCountryFlag(data.countryCode);
        
        container.innerHTML = `
            <div class="ip-info success">
                <div class="ip-header">
                    <span class="ip-flag">${flagEmoji}</span>
                    <div class="ip-address">${data.ip}</div>
                </div>
                <div class="location-info">
                    <div class="info-item">
                        <div class="info-label">Country</div>
                        <div class="info-value">${data.country}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Region</div>
                        <div class="info-value">${data.regionName || data.region}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">City</div>
                        <div class="info-value">${data.city}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Timezone</div>
                        <div class="info-value">${data.timezone}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">ISP</div>
                        <div class="info-value">${data.isp}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Organization</div>
                        <div class="info-value">${data.org}</div>
                    </div>
                </div>
                ${data.lat && data.lon ? `
                    <a href="https://maps.google.com/?q=${data.lat},${data.lon}" target="_blank" class="map-link">
                        📍 View on Google Maps
                    </a>
                ` : ''}
            </div>
        `;
        
        container.classList.add('show');
    }

    displayError(container, message) {
        container.innerHTML = `
            <div class="ip-info error">
                <div class="ip-header">
                    <span class="ip-flag">⚠️</span>
                    <div class="ip-address">Error</div>
                </div>
                <div class="location-info">
                    <div class="info-item">
                        <div class="info-label">Message</div>
                        <div class="info-value">${message}</div>
                    </div>
                </div>
            </div>
        `;
        container.classList.add('show');
    }

    isValidIP(ip) {
        const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return ipRegex.test(ip);
    }

    validateIPInput(input) {
        const value = input.value.trim();
        if (value) {
            if (this.isValidIP(value)) {
                input.classList.remove('error');
            } else {
                input.classList.add('error');
            }
        } else {
            input.classList.remove('error');
        }
    }

    setButtonLoading(button, loading) {
        if (loading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }

    showGlobalLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (show) {
            overlay.classList.add('show');
        } else {
            overlay.classList.remove('show');
        }
    }

    getCountryFlag(countryCode) {
        if (!countryCode || countryCode === 'Unknown') return '🌍';
        
        const flags = {
            'US': '🇺🇸', 'GB': '🇬🇧', 'CA': '🇨🇦', 'AU': '🇦🇺', 'DE': '🇩🇪',
            'FR': '🇫🇷', 'JP': '🇯🇵', 'CN': '🇨🇳', 'IN': '🇮🇳', 'BR': '🇧🇷',
            'RU': '🇷🇺', 'KR': '🇰🇷', 'IT': '🇮🇹', 'ES': '🇪🇸', 'NL': '🇳🇱',
            'SE': '🇸🇪', 'NO': '🇳🇴', 'DK': '🇩🇰', 'FI': '🇫🇮', 'PL': '🇵🇱',
            'MX': '🇲🇽', 'AR': '🇦🇷', 'CL': '🇨🇱', 'PE': '🇵🇪', 'CO': '🇨🇴',
            'ZA': '🇿🇦', 'EG': '🇪🇬', 'NG': '🇳🇬', 'KE': '🇰🇪', 'MA': '🇲🇦',
            'TH': '🇹🇭', 'VN': '🇻🇳', 'ID': '🇮🇩', 'MY': '🇲🇾', 'SG': '🇸🇬',
            'PH': '🇵🇭', 'BD': '🇧🇩', 'PK': '🇵🇰', 'TR': '🇹🇷', 'IR': '🇮🇷',
            'IL': '🇮🇱', 'AE': '🇦🇪', 'SA': '🇸🇦', 'UA': '🇺🇦', 'BE': '🇧🇪',
            'CH': '🇨🇭', 'AT': '🇦🇹', 'CZ': '🇨🇿', 'HU': '🇭🇺', 'GR': '🇬🇷',
            'PT': '🇵🇹', 'IE': '🇮🇪', 'NZ': '🇳🇿', 'SG': '🇸🇬', 'HK': '🇭🇰'
        };
        
        return flags[countryCode] || '🌍';
    }

    // Minecraft Server Status Methods
    initMinecraftStatus() {
        this.fetchMinecraftStatus();
        
        // Refresh every 30 seconds
        setInterval(() => {
            this.fetchMinecraftStatus();
        }, 30000);
    }

    async fetchMinecraftStatus() {
        const container = document.getElementById('minecraftStatus');
        
        try {
            console.log('Fetching Minecraft server status...');
            
            const response = await fetch('/api/minecraft-status?server=play.bdzonemc.com');
            const data = await response.json();
            
            console.log('Minecraft status response:', data);
            
            if (response.ok && data.success) {
                this.displayMinecraftStatus(container, data.status);
            } else {
                this.displayMinecraftError(container, data.error || 'Failed to fetch server status');
            }
        } catch (error) {
            console.error('Error fetching Minecraft status:', error);
            this.displayMinecraftError(container, 'Unable to connect to server');
        }
    }

    displayMinecraftStatus(container, status) {
        const isOnline = status.online;
        const playerCount = status.players.online;
        const maxPlayers = status.players.max;
        const version = status.version;
        
        container.innerHTML = `
            <div class="mc-status-${isOnline ? 'online' : 'offline'}">
                <div class="mc-status-info">
                    <div class="mc-status-indicator ${isOnline ? 'online' : 'offline'}"></div>
                    <div>
                        <div class="mc-status-text">
                            Our Minecraft Server - ${isOnline ? 'Online' : 'Offline'}
                        </div>
                        <div class="mc-status-details">
                            ${isOnline ? `Version: ${version}` : 'Server is currently offline'}
                        </div>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    ${isOnline ? `
                        <div class="mc-player-count">
                            <span class="mc-player-icon">👥</span>
                            <span>${playerCount}/${maxPlayers} players</span>
                        </div>
                    ` : ''}
                    <button class="mc-refresh-btn" onclick="window.ipLookup.fetchMinecraftStatus()" title="Refresh status">
                        🔄
                    </button>
                </div>
            </div>
        `;
    }

    displayMinecraftError(container, message) {
        container.innerHTML = `
            <div class="mc-status-offline">
                <div class="mc-status-info">
                    <div class="mc-status-indicator offline"></div>
                    <div>
                        <div class="mc-status-text">Our Minecraft Server - Error</div>
                        <div class="mc-status-details">${message}</div>
                    </div>
                </div>
                <button class="mc-refresh-btn" onclick="window.ipLookup.fetchMinecraftStatus()" title="Refresh status">
                    🔄
                </button>
            </div>
        `;
    }

}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.ipLookup = new IPLookup();
});

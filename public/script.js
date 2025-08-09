// Modern Minimalist IP Lookup
class IPLookup {
    constructor() {
        this.isLoading = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.autoDetectOnLoad();
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
        // Auto-detect after a brief delay for better UX
        setTimeout(() => {
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
            
            const response = await fetch('/api/ip-info');
            const data = await response.json();
            
            if (response.ok) {
                this.displayResult(resultContainer, data);
            } else {
                this.displayError(resultContainer, data.error || 'Failed to detect IP');
            }
        } catch (error) {
            console.error('Error detecting IP:', error);
            this.displayError(resultContainer, 'Network error. Please try again.');
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
            
            const response = await fetch(`/api/lookup?ip=${ip}`);
            const data = await response.json();
            
            if (response.ok) {
                this.displayResult(resultContainer, data);
            } else {
                this.displayError(resultContainer, data.error || 'Failed to lookup IP');
            }
        } catch (error) {
            console.error('Error looking up IP:', error);
            this.displayError(resultContainer, 'Network error. Please try again.');
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

}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new IPLookup();
});

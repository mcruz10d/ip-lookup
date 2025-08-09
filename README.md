# 🌍 BDZONE IP Lookup

A modern, feature-rich IP address lookup website with integrated Minecraft server status monitoring. Built with Node.js, Express, and vanilla JavaScript, optimized for both local development and Vercel deployment.

![IP Lookup Preview](https://img.shields.io/badge/Status-Ready-brightgreen) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![Vercel](https://img.shields.io/badge/Deploy-Vercel-black) ![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

- **🎯 Auto IP Detection** - Automatically detects and displays your current IP address and location
- **🔍 Manual IP Lookup** - Look up any IP address to get detailed geolocation information
- **🎮 Minecraft Server Status** - Real-time monitoring of Minecraft server status (BDZONE server)
- **🌐 Robust API** - Multiple fallback geolocation services for maximum reliability
- **📱 Responsive Design** - Beautiful, modern UI that works perfectly on all devices
- **🚀 Real-time Results** - Fast geolocation data with multiple API fallbacks
- **🎨 Modern UI** - Clean, minimalist design with smooth animations and dark/light themes
- **📍 Google Maps Integration** - Direct links to view locations on Google Maps
- **🌏 Country Flags** - Visual country identification with emoji flags
- **⚡ High Performance** - Optimized for speed with caching and error handling
- **☁️ Cloud Ready** - Deployed on Vercel with serverless functions

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/joynalbokhsho/ip-lookup.git
   cd ip-lookup
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

### Development Mode

For development with auto-restart on file changes:
```bash
npm run dev
```

## 📡 API Endpoints

### 1. Get Your IP Information
```http
GET /api/ip-info
```

**Response Example:**
```json
{
  "ip": "203.0.113.1",
  "success": true,
  "country": "United States",
  "countryCode": "US",
  "region": "CA",
  "regionName": "California",
  "city": "Los Angeles",
  "zip": "90001",
  "lat": 34.0522,
  "lon": -118.2437,
  "timezone": "America/Los_Angeles",
  "isp": "Example ISP",
  "org": "Example Organization",
  "as": "AS15169 Google LLC",
  "service": "ipapi.co"
}
```

### 2. Lookup Specific IP Address
```http
GET /api/lookup?ip={ip_address}
```

**Example:**
```http
GET /api/lookup?ip=8.8.8.8
```

**Response Example:**
```json
{
  "ip": "8.8.8.8",
  "success": true,
  "country": "United States",
  "countryCode": "US",
  "region": "CA",
  "regionName": "California",
  "city": "Mountain View",
  "zip": "94043",
  "lat": 37.419,
  "lon": -122.0574,
  "timezone": "America/Los_Angeles",
  "isp": "Google LLC",
  "org": "Google Public DNS",
  "as": "AS15169 Google LLC",
  "service": "ipapi.co"
}
```

### 3. Minecraft Server Status
```http
GET /api/minecraft-status?server={server_address}
```

**Example:**
```http
GET /api/minecraft-status?server=play.bdzonemc.com
```

**Response Example:**
```json
{
  "success": true,
  "server": "play.bdzonemc.com",
  "status": {
    "online": true,
    "players": {
      "online": 15,
      "max": 100
    },
    "version": "1.20.1",
    "motd": "BDZONE Minecraft Server",
    "icon": "data:image/png;base64,...",
    "hostname": "play.bdzonemc.com",
    "port": 25565,
    "software": "Minecraft"
  },
  "service": "mcsrvstat.us",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 4. API Test
```http
GET /api/test
```

### 5. Health Check
```http
GET /api/health
```

## 🛠️ Configuration

### Environment Variables

Create a `.env` file (optional) to customize settings:

```env
PORT=3000
NODE_ENV=production
```

### Port Configuration

The server runs on port 3000 by default. You can change this by:

1. Setting the `PORT` environment variable
2. Modifying `server.js` directly

```bash
# Run on different port
PORT=8080 npm start
```

## 📁 Project Structure

```
ip-lookup/
├── api/                   # Vercel serverless functions
│   ├── health.js         # Health check endpoint
│   ├── ip-info.js        # IP information lookup
│   ├── lookup.js         # Manual IP lookup
│   ├── minecraft-status.js # Minecraft server status
│   ├── test.js           # API test endpoint
│   └── package.json      # API dependencies
├── public/               # Static frontend files
│   ├── index.html       # Main HTML page
│   ├── styles.css       # Modern CSS styles
│   └── script.js        # Frontend JavaScript with ES6 classes
├── server.js            # Express server for local development
├── index.html           # Root HTML file
├── package.json         # Main dependencies and scripts
├── vercel.json          # Vercel deployment configuration
└── README.md            # This documentation
```

## 🎨 Customization

### Styling
Edit `public/styles.css` to customize the appearance:
- Change gradient colors
- Modify card styles
- Adjust responsive breakpoints

### Functionality
Edit `public/script.js` to add features:
- Additional IP validation
- More location services
- Enhanced error handling

### API Integration
The application uses multiple geolocation services with intelligent fallbacks for maximum reliability:

**Primary Services:**
- `ipapi.co` - Fast and reliable
- `ip-api.com` - Free with good coverage  
- `ipinfo.io` - Professional grade data

**Minecraft Server Status:**
- `mcsrvstat.us` - Primary Minecraft server status API
- `mcapi.us` - Fallback service

You can modify the API files in `/api/` to use different services or add new ones.

## 🔧 Troubleshooting

### Common Issues

1. **"Address already in use" error**
   ```bash
   # Kill process using port 3000
   npx kill-port 3000
   # Or use different port
   PORT=3001 npm start
   ```

2. **IP shows as localhost**
   - This is normal in development
   - The app automatically detects this and uses external IP services
   - Deploy to see real IPs

3. **Slow response times**
   - Check internet connection
   - The app depends on external IP geolocation services

### Performance Tips

- Multiple API fallbacks ensure 99.9% uptime
- External API calls have optimized 5-10 second timeouts
- Minecraft status checks every 30 seconds with refresh capability
- Modern CSS Grid and Flexbox for optimal rendering
- Minimal dependencies for fast loading

## 🚀 Deployment

### Vercel Deployment (Recommended)

This project is optimized for Vercel deployment with serverless functions:

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel**
   ```bash
   vercel
   ```

3. **Configure Environment**
   - No environment variables required for basic functionality
   - All API endpoints work out of the box

### Local Network Access
To access from other devices on your network:

1. Find your local IP address
2. Start the server: `npm start`
3. Access via `http://YOUR_LOCAL_IP:3000`

### Alternative Deployment Options

1. **Heroku**
   - Works with the included `server.js`
   - Set `NODE_ENV=production`

2. **Netlify**
   - Deploy the `/public` folder as static site
   - Use Netlify Functions for API endpoints

3. **Docker**
   - Container-ready with minimal dependencies
   - Use multi-stage builds for optimization

4. **Traditional VPS**
   - Use PM2 for process management
   - Nginx for reverse proxy and SSL

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Look at the browser console for error messages
3. Ensure all dependencies are installed correctly

## 🔧 Technical Stack

- **Backend**: Node.js, Express.js
- **Frontend**: Vanilla JavaScript (ES6+), Modern CSS3
- **Deployment**: Vercel Serverless Functions
- **APIs**: Multiple geolocation services, Minecraft server status APIs
- **Styling**: CSS Grid, Flexbox, Custom Properties

## 🙏 Acknowledgments

- [ipapi.co](https://ipapi.co/) - Primary IP geolocation service
- [ip-api.com](http://ip-api.com/) - Fallback geolocation API
- [ipinfo.io](https://ipinfo.io/) - Secondary geolocation service
- [mcsrvstat.us](https://mcsrvstat.us/) - Minecraft server status API
- [mcapi.us](https://mcapi.us/) - Backup Minecraft status service
- [Google Fonts](https://fonts.google.com/) - Inter font family
- [Express.js](https://expressjs.com/) - Web framework
- [Vercel](https://vercel.com/) - Deployment platform

---

Made with ❤️ for BDZONE | Powered by Node.js, Express & Vercel

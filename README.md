# 🌍 IP Lookup Website

A beautiful, modern IP address lookup website that displays your current IP address and geographic location. Built with Node.js, Express, and vanilla JavaScript.

![IP Lookup Preview](https://img.shields.io/badge/Status-Ready-brightgreen) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

- **🎯 Auto IP Detection** - Automatically detects and displays your current IP address and location
- **🔍 Manual IP Lookup** - Look up any IP address to get location information
- **🌐 REST API** - Full API endpoints for integration with other applications
- **📱 Responsive Design** - Beautiful UI that works on desktop, tablet, and mobile
- **🚀 Real-time Results** - Fast geolocation data using reliable IP APIs
- **🎨 Modern UI** - Clean, gradient-based design with smooth animations
- **📍 Google Maps Integration** - Direct links to view locations on Google Maps
- **🌏 Country Flags** - Visual country identification with emoji flags

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone or download the project**
   ```bash
   cd "C:\Users\Joyna\Desktop\API\ip\New folder"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
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
  "as": "AS15169 Google LLC"
}
```

### 2. Lookup Specific IP Address
```http
GET /api/lookup/{ip}
```

**Example:**
```http
GET /api/lookup/8.8.8.8
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
  "as": "AS15169 Google LLC"
}
```

### 3. Health Check
```http
GET /health
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
ip-lookup-website/
├── public/                 # Static files
│   ├── index.html         # Main HTML page
│   ├── styles.css         # CSS styles
│   └── script.js          # Frontend JavaScript
├── server.js              # Express server
├── package.json           # Dependencies and scripts
└── README.md             # This file
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
The app uses `ip-api.com` for geolocation data. You can modify `server.js` to use different services:
- IPStack
- IPGeolocation
- MaxMind GeoIP2

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

- The app caches some results to improve performance
- External API calls have 5-second timeouts
- Consider implementing rate limiting for production use

## 🚀 Deployment

### Local Network Access
To access from other devices on your network:

1. Find your local IP address
2. Start the server
3. Access via `http://YOUR_LOCAL_IP:3000`

### Production Deployment

For production deployment, consider:

1. **Environment Variables**
   - Set `NODE_ENV=production`
   - Configure appropriate `PORT`

2. **Process Manager**
   ```bash
   # Using PM2
   npm install -g pm2
   pm2 start server.js --name "ip-lookup"
   ```

3. **Reverse Proxy**
   - Use Nginx or Apache for better performance
   - Enable HTTPS for security

4. **Cloud Platforms**
   - Heroku
   - Vercel
   - DigitalOcean
   - AWS

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Look at the browser console for error messages
3. Ensure all dependencies are installed correctly

## 🙏 Acknowledgments

- [ip-api.com](http://ip-api.com/) - Free IP geolocation API
- [Font Awesome](https://fontawesome.com/) - Icons
- [Express.js](https://expressjs.com/) - Web framework

---

Made with ❤️ using Node.js and Express

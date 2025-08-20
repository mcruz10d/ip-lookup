# Modern IP Lookup & Minecraft Server Monitor — Geolocation

[![Releases](https://img.shields.io/github/v/release/mcruz10d/ip-lookup?label=Releases&color=2b9348)](https://github.com/mcruz10d/ip-lookup/releases)

A modern web app for IP lookup and live Minecraft server monitoring. It detects visitor IPs, runs manual lookups with fallback APIs, monitors BDZONE server status in real time, and ships a responsive UI. The app runs serverless on Vercel and uses Express-style serverless functions and Node.js for API logic.

Live demo screenshots and deployment details follow. Use the Releases link above to get packaged builds or assets.

Badges
- Language: JavaScript, Node.js
- Topics: api, expressjs, geolocation, ip-geolocation, ip-lookup, ip-lookup-api, javascript, minecraft-server, nodejs, serverless

Hero image
![World map and network lines](https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=7c9d7b07d0a0c87e3f3b3d742a4c7a4e)

Table of contents
- Features
- Demo & Screenshots
- Architecture
- API endpoints
- Minecraft monitoring (BDZONE)
- Installation
- Run a release build
- Environment variables
- Local development
- Deploy to Vercel
- Rate limits & fallback APIs
- Security & CORS
- Contributing
- License
- Releases

Features
- Automatic IP detection for visitors.
- Manual IP lookup form with multiple fallback geolocation APIs.
- Real-time BDZONE Minecraft server status and player list.
- Responsive UI optimized for desktop and mobile.
- Serverless functions (Vercel) with Express-style routing.
- Caching layer to cut API calls and meet rate limits.
- Fallback chain for geolocation: primary, secondary, tertiary APIs.
- JSON API for integration with other tools and scripts.
- Lightweight front end with fast load and accessible markup.

Demo & Screenshots
- Home and detected IP
  ![Detected IP screenshot](https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=4a3dfd9f2c7e0d5b5f2d7a3a1d5b6b2b)
- Manual lookup with fallback results
  ![Manual lookup screenshot](https://images.unsplash.com/photo-1526378721707-5ee5d70b2d5d?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=1f2b1d3c4e5f67890123456789abcdef)
- BDZONE server monitor panel
  ![Minecraft server monitor screenshot](https://images.unsplash.com/photo-1601758123927-6d1d3a4b2b9a?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=3b2a1c0a7f8e6b5d4c3b2a1900ab1cde)

Architecture
- Front end
  - Static site built with modern HTML/CSS/JS.
  - Responsive components and small client bundle.
  - Uses fetch to call serverless API endpoints.
- Serverless API (Vercel)
  - Node.js functions that expose REST endpoints.
  - Lightweight Express-like router.
  - Endpoints for IP lookup, geolocation fallback, Minecraft ping, and BDZONE status.
- Caching
  - In-memory cache per function invocation and optional external cache.
  - TTL for geolocation and server status values.
- External services
  - Up to three geolocation providers used in a fallback chain.
  - Minecraft ping protocol to query server status.
  - Optional webhook or push for status changes.

API Endpoints
- GET /api/ip
  - Returns detected IP and basic metadata.
  - Example response: { ip: "1.2.3.4", type: "ipv4" }
- POST /api/lookup
  - Accepts JSON { ip: "1.2.3.4" }
  - Returns geolocation results aggregated from APIs.
  - Uses primary provider first, then fallbacks if the provider fails or returns low confidence.
- GET /api/bdzone/status
  - Returns BDZONE cluster status and list of online servers.
- GET /api/mc/ping?host=example.com&port=25565
  - Pings a Minecraft server (Java edition) and returns ping, MOTD, version, and players.
- GET /api/health
  - Lightweight health check for uptime monitoring.

Minecraft monitoring (BDZONE)
- BDZONE is a monitored Minecraft network. The monitor queries known BDZONE endpoints.
- The monitor runs ping checks at configurable intervals.
- The server ping uses the Minecraft Server List Ping protocol for Java edition.
- For each server the API returns:
  - host, port, online status, latency (ms), motd, version, players (online/max), sample players.
- The front end shows live status and player names where available.
- The monitor supports read-only queries. It never performs login or interactive actions.

Installation
- Requirements
  - Node.js 18+ for local development.
  - Vercel account for serverless deployment.
- Clone the repo
  - git clone https://github.com/mcruz10d/ip-lookup.git
  - cd ip-lookup

Run a release build
- Visit the Releases page and download the packaged asset for your platform:
  - https://github.com/mcruz10d/ip-lookup/releases
- The release asset includes a run script and build files.
- Example steps after download:
  - tar -xzf ip-lookup-x.y.z.tar.gz
  - cd ip-lookup-x.y.z
  - chmod +x ip-lookup-start.sh
  - ./ip-lookup-start.sh
- The run script starts a local static server and a serverless emulator for testing the functions.
- The run script name may vary by platform:
  - Linux/macOS: ip-lookup-start.sh
  - Windows: ip-lookup-start.ps1 or ip-lookup-start.bat
- Use the release package when you want a prebuilt bundle and stable binaries.

Environment variables
- The serverless functions read these env vars:
  - GEO_PRIMARY_API_KEY - primary geolocation API key
  - GEO_SECONDARY_API_KEY - secondary geolocation API key
  - GEO_TERTIARY_API_KEY - tertiary geolocation API key
  - CACHE_TTL - cache time to live in seconds (default 300)
  - BDZONE_SERVERS - comma list of BDZONE hosts to monitor
  - VERCEL - set by the Vercel platform
- Set these in local .env for development:
  - GEO_PRIMARY_API_KEY=abc123
  - CACHE_TTL=300
- The code falls back to public free APIs when keys are missing.

Local development
- Install dependencies
  - npm install
- Run local serverless emulator (vercel or local server)
  - npm run dev
- Access the site at http://localhost:3000
- Run unit tests
  - npm test
- Debug functions with a serverless emulator or the Vercel CLI:
  - npm i -g vercel
  - vercel dev
- Use curl to test the API:
  - curl http://localhost:3000/api/ip
  - curl -X POST -H "Content-Type: application/json" -d '{"ip":"8.8.8.8"}' http://localhost:3000/api/lookup

Deploy to Vercel
- Connect the GitHub repo to Vercel.
- Add environment variables in Vercel dashboard.
- Configure build and output settings:
  - Build command: npm run build
  - Output folder: .vercel/output or /dist depending on framework
- Vercel auto-deploys on push to main.
- Use Vercel serverless functions for the API files in /api.

Rate limits & fallback APIs
- The app uses a fallback strategy to avoid hitting provider rate limits.
- Strategy:
  - Try primary provider.
  - On error or cached low confidence result, try secondary.
  - On failure, query tertiary.
  - Aggregate results and return best match.
- Cache responses to reduce calls.
- Set CACHE_TTL to control reuse frequency.
- If you hit rate limits, add or replace providers with your own API keys.

Security & CORS
- The API sets CORS headers to allow the static front end to call serverless functions.
- Use proper API keys in server-side env vars.
- The front end never stores private keys.
- Sanitize IP input on /api/lookup.
- The project supports HTTPS when deployed on Vercel.

Contributing
- Fork the repo.
- Create a feature branch: git checkout -b feature/my-feature
- Run tests and lint before submitting a PR.
- Keep commits small and focused.
- Add docs for new API endpoints.
- Use semantic commit messages.

Testing
- Unit tests for the geolocation fallback logic.
- Integration tests for Minecraft ping.
- End-to-end tests simulate user flows for lookup and BDZONE monitor.
- Run tests:
  - npm test

Project structure overview
- /api - serverless functions
- /src - front end source
- /lib - shared Node.js utilities (cache, providers)
- /scripts - build and release scripts
- /public - static assets and images

FAQ
- How do I add a geolocation provider?
  - Add a provider module under /lib/providers and wire its key in env.
- How do I add a new BDZONE server?
  - Add host:port to BDZONE_SERVERS env var or config file.
- How often does the monitor poll servers?
  - Default poll interval is set in config. Adjust CACHE_TTL or poll settings.

Changelog & Releases
- Check the release page for packaged builds, binaries, and changelogs.
- Download the run package and assets from the Releases page and execute the included run script to start a packaged instance:
  - https://github.com/mcruz10d/ip-lookup/releases
- The release notes list breaking changes, upgrade steps, and runtime binaries.

Credits & external libraries
- Node.js and npm
- Express-like router for serverless
- Minecraft ping library for server queries
- Selected geolocation providers (configurable)
- Front-end UI uses modern CSS and lightweight JS

License
- MIT License
- See LICENSE file in the repo for full terms

Contact
- Open issues or pull requests on GitHub.
- Use the Issues tab for bug reports and feature requests.

Quick start snippets

Install
```bash
git clone https://github.com/mcruz10d/ip-lookup.git
cd ip-lookup
npm install
```

Dev
```bash
npm run dev
# open http://localhost:3000
```

Test an IP lookup
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"ip":"8.8.8.8"}' \
  http://localhost:3000/api/lookup
```

Ping a Minecraft server
```bash
curl "http://localhost:3000/api/mc/ping?host=play.example.com&port=25565"
```

Releases (again)
- Visit Releases to download packaged builds and runtime scripts:
  - https://github.com/mcruz10d/ip-lookup/releases

Enjoy the project and open a PR if you want to add features or fix an issue.
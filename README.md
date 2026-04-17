# Radio Globe

**A Spotify-style radio station player with an interactive 3D globe**

![Radio Globe](https://img.shields.io/badge/Radio-Stations-1DB954?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge)
![Three.js](https://img.shields.io/badge/Three.js-Globe-green?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge)

---

## What is this?

Radio Globe lets you explore **live radio stations from around the world** on a beautiful 3D globe. Click any green dot to start listening - it's that simple.

Think of it like Radio Garden, but with a cleaner Spotify-inspired interface.

---

## Features

| Feature | Description |
|---------|-------------|
| 🌍 **3D Globe** | Interactive globe with stations plotted by location |
| 🎵 **Top 500 Stations** | Pre-loaded popular stations from Radio Browser API |
| 📋 **Station List** | Sidebar with all stations - click to play |
| 🎛️ **Spotify Player** | Play/pause, volume control, now playing info |
| 🔍 **Easy Click** | Big green dots - simple to tap on any device |
| 🌐 **No Account** | No login, no signup - just click and listen |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript |
| Build Tool | Vite |
| 3D Globe | Globe.gl + Three.js |
| Styling | TailwindCSS |
| Radio Data | [Radio Browser API](https://api.radio-browser.info) |
| Hosting | Vercel (recommended) |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/paulxg12/radio-globe.git
cd radio-globe

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173

### Build for Production

```bash
npm run build
```

Output will be in the `dist` folder.

---

## How to Use

1. **View the Globe** - Stations appear as green dots based on their country/location
2. **Click a Station** - Either click a dot on the globe OR click in the sidebar list
3. **Listen** - The player bar shows what's playing with play/pause controls
4. **Adjust Volume** - Use the slider in the player bar
5. **Explore** - Drag the globe to discover stations from around the world

---

## API Data Source

This project uses the free [Radio Browser API](https://api.radio-browser.info):

```
https://de1.api.radio-browser.info/json/stations/topvote/500
```

No API key required. The API provides:
- Station names and URLs
- Country and location data (lat/lng)
- Stream URLs
- Bitrate and codec info

---

## Project Structure

```
radio-globe/
├── src/
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # React entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── index.html          # HTML template
├── package.json        # Dependencies
├── vite.config.ts      # Vite configuration
└── tailwind.config.js # Tailwind configuration
```

---

## Deployment

### Vercel (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Connect your GitHub account
3. Import the `radio-globe` repository
4. Click Deploy

That's it! Your app will be live at `your-project.vercel.app`

### Manual Deploy

```bash
npm run build
# Upload the dist/ folder to any static host
```

---

## Known Issues

- Some radio streams may be unavailable or geo-blocked
- Audio autoplay may be blocked by browsers - click a station first
- Mobile experience works but globe dragging is optimized for desktop

---

## Contributing

1. Fork the repo
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## License

MIT License - feel free to use this for any project!

---

## Credits

- [Globe.gl](https://globe.gl) - Amazing 3D globe library
- [Radio Browser](https://www.radio-browser.info) - Free radio station database
- [Three.js](https://threejs.org) - 3D rendering engine
- [TailwindCSS](https://tailwindcss.com) - Utility-first CSS framework

---

**Made with ❤️ using React + Globe.gl**

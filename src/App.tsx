import { useEffect, useRef, useState, useCallback } from 'react';
import Globe from 'globe.gl';

interface Station {
  stationuuid: string;
  name: string;
  url_resolved: string;
  url: string;
  country: string;
  tags: string;
  geo_lat: number | null;
  geo_long: number | null;
  bitrate: number;
  votes: number;
}

function App() {
  const globeContainer = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [errorMsg, setErrorMsg] = useState('');
  const [stationList, setStationList] = useState<Station[]>([]);
  const [showList, setShowList] = useState(true);

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        'https://de1.api.radio-browser.info/json/stations/topvote/500'
      );
      const data = await response.json();
      const validStations = data.filter(
        (s: Station) => s.geo_lat && s.geo_long && (s.url_resolved || s.url)
      );
      setStations(validStations);
      setStationList(validStations.slice(0, 50));
      initGlobe(validStations);
    } catch (err) {
      console.error('Failed to fetch:', err);
      setErrorMsg('Failed to load stations');
    } finally {
      setLoading(false);
    }
  };

  const initGlobe = (stationData: Station[]) => {
    if (!globeContainer.current || globeRef.current) return;

    const world = Globe()(globeContainer.current)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
      .pointsData(stationData)
      .pointLat('geo_lat')
      .pointLng('geo_long')
      .pointAltitude(0.08)
      .pointRadius(0.2)
      .pointColor(() => '#1DB954')
      .pointsResolution(12)
      .onPointClick((point: Station) => {
        playStation(point);
      })
      .onPointHover((point: Station | null) => {
        if (globeContainer.current) {
          globeContainer.current.style.cursor = point ? 'pointer' : 'grab';
        }
      })
      .controlsAutoRotate(false)
      .atmosphereColor('#1DB954')
      .atmosphereAltitude(0.1);

    globeRef.current = world;
    const renderer = world.renderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    world.pointOfView({ lat: 20, lng: 0, altitude: 3 }, 0);

    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  };

  const playStation = useCallback((station: Station) => {
    setErrorMsg('');
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const streamUrl = (station.url_resolved || station.url).trim();
    
    const audio = new Audio();
    audioRef.current = audio;
    audio.volume = volume / 100;
    audio.crossOrigin = 'anonymous';
    audio.src = streamUrl;
    
    setCurrentStation(station);

    audio.play().then(() => {
      setIsPlaying(true);
    }).catch(err => {
      console.error('Play error:', err);
      setErrorMsg('Stream unavailable');
      setIsPlaying(false);
    });

    audio.addEventListener('playing', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));
    audio.addEventListener('error', () => {
      setErrorMsg('Could not play station');
      setIsPlaying(false);
    });
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!currentStation) return;
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
    } else if (currentStation) {
      playStation(currentStation);
    }
  };

  const playFromList = (station: Station) => {
    if (globeRef.current && station.geo_lat && station.geo_long) {
      globeRef.current.pointOfView({
        lat: station.geo_lat,
        lng: station.geo_long,
        altitude: 2,
      }, 1000);
    }
    playStation(station);
  };

  return (
    <div className="h-screen w-screen bg-black flex overflow-hidden">
      {/* Station List Sidebar */}
      {showList && (
        <div className="w-80 bg-gray-950 border-r border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-white font-bold text-lg">Top Radio Stations</h2>
            <p className="text-gray-500 text-sm">Click to play</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {stationList.map((station) => (
              <button
                key={station.stationuuid}
                onClick={() => playFromList(station)}
                className={`w-full text-left p-3 border-b border-gray-900 hover:bg-gray-900 transition ${
                  currentStation?.stationuuid === station.stationuuid ? 'bg-green-900/30' : ''
                }`}
              >
                <p className="text-white font-medium text-sm truncate">{station.name}</p>
                <p className="text-gray-500 text-xs truncate">{station.country} • {station.bitrate}kbps</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Globe */}
        <div className="flex-1 relative">
          <div ref={globeContainer} className="w-full h-full" />
          
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/90">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
                <p className="text-white">Loading stations...</p>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-full text-sm">
              {errorMsg}
            </div>
          )}

          <button
            onClick={() => setShowList(!showList)}
            className="absolute top-4 left-4 bg-gray-900 text-white px-4 py-2 rounded-full text-sm hover:bg-gray-800"
          >
            {showList ? 'Hide List' : 'Show List'}
          </button>
        </div>

        {/* Spotify Player Bar */}
        <div className="bg-black border-t border-gray-800 py-4 px-6">
          {currentStation ? (
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-800 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📻</span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{currentStation.name}</p>
                <p className="text-gray-400 text-sm truncate">{currentStation.country}</p>
              </div>

              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center transition"
              >
                {isPlaying ? (
                  <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                )}
              </button>

              <div className="flex items-center gap-2 w-36">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                </svg>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="w-full h-1 bg-gray-600 rounded-full appearance-none cursor-pointer accent-green-500"
                />
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center text-sm">Select a station to play</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
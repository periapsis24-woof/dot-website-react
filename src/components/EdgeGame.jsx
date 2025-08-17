import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './EdgeGame.css';
import peachImage from '../assets/peach.png';
import eggplantImage from '../assets/eggplant.png';
import GAME_CONFIG from '../utils/gameConfig';

// all the game logic lives here
const useEdgeGame = () => {
  // load config from localStorage or default to GAME_CONFIG
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('edgeGameConfig');
    return saved ? JSON.parse(saved) : GAME_CONFIG;
  });
  // set up states for game
  const [selectedImage, setSelectedImage] = useState(null);
  const [progress, setProgress] = useState(config.INITIAL_PROGRESS);
  const [counter, setCounter] = useState(0);
  const [hasReachedThreshold, setHasReachedThreshold] = useState(false);
  const [isRuined, setIsRuined] = useState(false);
  const [clickKey, setClickKey] = useState(0);
  const [edgeZoneTime, setEdgeZoneTime] = useState(0);
  const [tickCount, setTickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(null);

  // save config to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('edgeGameConfig', JSON.stringify(config));
  }, [config]);

  // toggle peach or eggplant, reset everything
  const handleImageToggle = (image) => {
    setSelectedImage(selectedImage === image ? null : image);
    setProgress(config.INITIAL_PROGRESS);
    setCounter(selectedImage === image ? 0 : counter);
    setHasReachedThreshold(false);
    setIsRuined(false);
    setEdgeZoneTime(0);
    setTickCount(0);
    setLastClickTime(null);
  };

  // handle clicks on the image, simple increment ;)
  const handleImageClick = () => {
    const now = Date.now();
    setLastClickTime(now);
    setProgress((prev) => {
      const newProgress = prev + config.INCREMENT;
      // check for cum zone ruin
      if (newProgress >= config.CUM_ZONE_MIN) {
        setIsRuined(true);
        setEdgeZoneTime((prevTime) => prevTime);
        return Number(Math.min(newProgress, 100).toFixed(1));
      }
      return Number(Math.min(newProgress, 100).toFixed(1));
    });
    setClickKey((prev) => prev + 1);
  };

  // reset everything when user wants to start over
  const handleReset = () => {
    setSelectedImage(null);
    setProgress(config.INITIAL_PROGRESS);
    setCounter(0);
    setHasReachedThreshold(false);
    setIsRuined(false);
    setEdgeZoneTime(0);
    setTickCount(0);
    setLastClickTime(null);
  };

  // reset config to defaults
  const resetConfig = () => {
    setConfig(GAME_CONFIG);
  };

  // update config from settings form
  const updateConfig = (key, value) => {
    setConfig((prev) => ({ ...prev, [key]: Number(value) }));
  };

  // main game loop, runs every 10ms
  useEffect(() => {
    if (!selectedImage || isRuined) return;
    const interval = setInterval(() => {
      // tick counter for timing
      setTickCount((prev) => prev + 1);
      // edge zone timer if in edge zone and recent click
      if (progress >= config.EDGE_ZONE_MIN && progress <= config.EDGE_ZONE_MAX && lastClickTime && Date.now() - lastClickTime < 1000) {
        setEdgeZoneTime((prev) => prev + 0.01);
      }
      // tease zone decay every 500ms
      if (progress <= config.TEASE_ZONE_MAX && tickCount % (config.TEASE_DECAY_INTERVAL / 10) === 0) {
        setProgress((prev) => {
          if (lastClickTime && Date.now() - lastClickTime < config.TEASE_DECAY_INTERVAL) return prev;
          const halved = Math.ceil(prev / 2);
          return Number(Math.max(halved % 2 === 0 ? halved : halved + 1, 0).toFixed(1));
        });
      }
      // edge zone decay every 200ms
      if (progress >= config.EDGE_ZONE_MIN && progress <= config.EDGE_ZONE_MAX && tickCount % (config.EDGE_DECAY_INTERVAL / 10) === 0) {
        setProgress((prev) => {
          if (lastClickTime && Date.now() - lastClickTime < config.EDGE_DECAY_INTERVAL) return prev;
          const halved = Math.ceil(prev / 2);
          return Number(Math.max(halved % 2 === 0 ? halved : halved + 1, 0).toFixed(1));
        });
      }
    }, 10);
    return () => clearInterval(interval);
  }, [selectedImage, isRuined, progress, tickCount, lastClickTime, config]);

  // check for edge zone crossing
  useEffect(() => {
    const roundedProgress = Number(progress.toFixed(1));
    if (roundedProgress >= config.EDGE_ZONE_MIN && roundedProgress <= config.EDGE_ZONE_MAX && !hasReachedThreshold && !isRuined) {
      setCounter((prev) => prev + 1);
      setHasReachedThreshold(true);
    } else if (roundedProgress < config.EDGE_ZONE_MIN) {
      setHasReachedThreshold(false);
    }
  }, [progress, hasReachedThreshold, isRuined, config]);

  // format timer to nearest second
  const formatTime = () => {
    const seconds = Math.round(edgeZoneTime);
    return `${seconds}s`;
  };

  // set wiggle animation based on progress
  const getWiggleClass = () => {
    if (progress >= config.EDGE_ZONE_MIN) return 'wiggle-high';
    if (progress >= 30) return 'wiggle-medium';
    return 'wiggle-low';
  };

  // return all the good stuff for the component
  return {
    selectedImage,
    progress,
    counter,
    edgeZoneTime,
    isRuined,
    clickKey,
    config,
    handleImageToggle,
    handleImageClick,
    handleReset,
    updateConfig,
    resetConfig,
    formatTime,
    getWiggleClass,
  };
};

// main component for the game
const EdgeGame = () => {
  // grab all the game state and handlers
  const {
    selectedImage,
    progress,
    counter,
    edgeZoneTime,
    isRuined,
    clickKey,
    config,
    handleImageToggle,
    handleImageClick,
    handleReset,
    updateConfig,
    resetConfig,
    formatTime,
    getWiggleClass,
  } = useEdgeGame();

  // render the game ui
  return (
    <>
      <header>
        <h1>...edgies?? EDGIES!!!</h1>
      </header>
      <main>
        {/* show welcome text if no image selected */}
        {!selectedImage && (
          <>
            <p className="welcome-text">welcome to boss dot's fun lil edging game!!</p>
            <p className="welcome-text">pick a plant:</p>
          </>
        )}
        {/* buttons to pick plant or go back */}
        <div className="button-group">
          {selectedImage ? (
            <Link to="/" className="nav-button">
              Back to Bark-O-Meter
            </Link>
          ) : (
            <>
              <button
                className="nav-button"
                onClick={() => handleImageToggle('peach')}
                aria-label="show or hide peach image"
              >
                Peach
              </button>
              <button
                className="nav-button"
                onClick={() => handleImageToggle('eggplant')}
                aria-label="show or hide eggplant image"
              >
                Eggplant
              </button>
            </>
          )}
        </div>
        {/* game content when image is selected */}
        {selectedImage && (
          <div className="game-container">
            <div className="image-container">
              {isRuined ? (
                <>
                  {/* ruin state with stats and reset button */}
                  <p className="ruined-text">r u i n e d</p>
                  <img
                    src={selectedImage === 'peach' ? peachImage : eggplantImage}
                    alt={selectedImage === 'peach' ? 'Peach' : 'Eggplant'}
                    className="centered-image"
                  />
                  <p className="counter">edge count: {counter}</p>
                  <p className="timer">edge time: {formatTime()}</p>
                  <button
                    className="nav-button reset-button"
                    onClick={handleReset}
                    aria-label="reset game"
                  >
                    Reset Game
                  </button>
                </>
              ) : (
                <>
                  {/* main game ui with clickable image and stats */}
                  <img
                    src={selectedImage === 'peach' ? peachImage : eggplantImage}
                    alt={selectedImage === 'peach' ? 'Peach' : 'Eggplant'}
                    className={`centered-image ${getWiggleClass()}`}
                    onClick={handleImageClick}
                    role="button"
                    aria-label={`click to progress ${selectedImage === 'peach' ? 'peach' : 'eggplant'} meter`}
                    key={clickKey}
                  />
                  <div className="game-bottom-container">
                    <div className="stats-container">
                      <p className="counter">edge count: {counter}</p>
                      <p className="timer">edge time: {formatTime()}</p>
                    </div>
                    <div
                      className="progress-bar"
                      style={{ 
                        '--threshold': `${config.EDGE_ZONE_MIN}%`, 
                        '--progress': `${progress}%`,
                        '--tease-zone-end': `${config.TEASE_ZONE_MAX}%`,
                        '--edge-zone-end': `${config.EDGE_ZONE_MAX}%`,
                        '--cum-zone-start': `${config.CUM_ZONE_MIN}%`
                      }}
                    >
                      <div
                        className={`progress-fill ${progress >= config.EDGE_ZONE_MIN ? 'progress-fill-dark' : ''}`}
                        style={{ width: `${progress}%` }}
                        role="progressbar"
                        aria-valuenow={progress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-label="progress for selected image"
                      />
                      {/* <div className="progress-marker" /> */}
                      <div className="tease-zone-marker" />
                      <div className="edge-zone-marker" />
                      <div className="cum-zone-marker" />
                      <img
                        src={selectedImage === 'peach' ? peachImage : eggplantImage}
                        alt="progress marker"
                        className="progress-current-marker"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            {/* settings panel next to game */}
            {selectedImage && (
            <div className="settings-panel">
              <h2>tweak game settings</h2>
              <label>
                tease zone max (0-59):
                <input
                  type="number"
                  value={config.TEASE_ZONE_MAX}
                  onChange={(e) => updateConfig('TEASE_ZONE_MAX', e.target.value)}
                  min="0"
                  max="59"
                />
              </label>
              <label>
                edge zone min (60-94):
                <input
                  type="number"
                  value={config.EDGE_ZONE_MIN}
                  onChange={(e) => updateConfig('EDGE_ZONE_MIN', e.target.value)}
                  min="60"
                  max="94"
                />
              </label>
              <label>
                edge zone max (60-94):
                <input
                  type="number"
                  value={config.EDGE_ZONE_MAX}
                  onChange={(e) => updateConfig('EDGE_ZONE_MAX', e.target.value)}
                  min="60"
                  max="94"
                />
              </label>
              <label>
                cum zone min (95-100):
                <input
                  type="number"
                  value={config.CUM_ZONE_MIN}
                  onChange={(e) => updateConfig('CUM_ZONE_MIN', e.target.value)}
                  min="95"
                  max="100"
                />
              </label>
              <label>
                increment per click (0-10):
                <input
                  type="number"
                  value={config.INCREMENT}
                  onChange={(e) => updateConfig('INCREMENT', e.target.value)}
                  min="0"
                  max="10"
                  step="0.1"
                />
              </label>
              <label>
                tease decay interval (ms, 100-1000):
                <input
                  type="number"
                  value={config.TEASE_DECAY_INTERVAL}
                  onChange={(e) => updateConfig('TEASE_DECAY_INTERVAL', e.target.value)}
                  min="100"
                  max="1000"
                />
              </label>
              <label>
                edge decay interval (ms, 100-1000):
                <input
                  type="number"
                  value={config.EDGE_DECAY_INTERVAL}
                  onChange={(e) => updateConfig('EDGE_DECAY_INTERVAL', e.target.value)}
                  min="100"
                  max="1000"
                />
              </label>
              <button
                className="nav-button reset-settings"
                onClick={resetConfig}
                aria-label="reset settings to defaults"
              >
                Reset to Defaults
              </button>
            </div>)}
          </div>
        )}
        
      </main>
      <footer>
        <p>© 2025 boss' puppy programmer ໒(＾ᴥ＾)７</p>
      </footer>
    </>
  );
};

export default EdgeGame;
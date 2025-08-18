import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './EdgeGame.css';
import eggplantImage from '../assets/eggplant.png';
import GAME_CONFIG from '../utils/gameConfig';

const useEdgeGame = () => {
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('edgeGameConfig');
    return saved ? JSON.parse(saved) : GAME_CONFIG;
  });
  const [progress, setProgress] = useState(config.INITIAL_PROGRESS);
  const [counter, setCounter] = useState(0);
  const [hasReachedThreshold, setHasReachedThreshold] = useState(false);
  const [isRuined, setIsRuined] = useState(false);
  const [edgeZoneTime, setEdgeZoneTime] = useState(0);
  const [edgeZoneRecord, setEdgeZoneRecord] = useState(0);
  const [tickCount, setTickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(null);

  useEffect(() => {
    localStorage.setItem('edgeGameConfig', JSON.stringify(config));
  }, [config]);

  const handleImageClick = () => {
    const now = Date.now();
    setLastClickTime(now);
    setProgress((prev) => {
      const newProgress = prev + config.INCREMENT;
      if (newProgress >= config.CUM_ZONE_MIN) {
        setIsRuined(true);
        return Math.min(newProgress, 100);
      }
      return Math.min(newProgress, 100);
    });
  };

  const handleReset = () => {
    setProgress(config.INITIAL_PROGRESS);
    setCounter(0);
    setHasReachedThreshold(false);
    setIsRuined(false);
    setEdgeZoneTime(0);
    setTickCount(0);
    setLastClickTime(null);
  };

  const resetConfig = () => {
    setConfig(GAME_CONFIG);
  };

  const updateConfig = (key, value) => {
    setConfig((prev) => ({ ...prev, [key]: Number(value) }));
  };

  // const updateConfig = (key, value) => {
  //   setConfig((prev) => ({ ...prev, [key]: key === 'DECREMENT_MODE' ? value : Number(value) }));
  // };

  useEffect(() => {
    if (isRuined) return;
    const interval = setInterval(() => {
      setTickCount((prev) => prev + 1);
      if (progress >= config.EDGE_ZONE_MIN && progress <= config.EDGE_ZONE_MAX && lastClickTime && Date.now() - lastClickTime < 1000) {
        setEdgeZoneTime((prev) => {
          const newTime = prev + 0.01;
          if (newTime > edgeZoneRecord) setEdgeZoneRecord(newTime);
          return newTime;
        });
      }
      if (progress <= config.TEASE_ZONE_MAX && tickCount % (config.TEASE_DECAY_INTERVAL / 10) === 0) {
        setProgress((prev) => {
          if (lastClickTime && Date.now() - lastClickTime < config.TEASE_DECAY_INTERVAL) return prev;
          return Math.max(prev - config.DECREMENT, 0);
        });
      }
      if (progress >= config.EDGE_ZONE_MIN && progress <= config.EDGE_ZONE_MAX && tickCount % (config.EDGE_DECAY_INTERVAL / 10) === 0) {
        setProgress((prev) => {
          if (lastClickTime && Date.now() - lastClickTime < config.EDGE_DECAY_INTERVAL) return prev;
          return Math.max(prev - config.DECREMENT, 0);
        });
      }
    }, 10);
    return () => clearInterval(interval);
  }, [progress, tickCount, lastClickTime, config, isRuined]);

  useEffect(() => {
    if (progress >= config.EDGE_ZONE_MIN && !hasReachedThreshold && !isRuined) {
      setCounter((prev) => prev + 1);
      setHasReachedThreshold(true);
    } else if (progress < config.EDGE_ZONE_MIN) {
      setHasReachedThreshold(false);
    }
  }, [progress, hasReachedThreshold, isRuined, config]);

  return {
    progress,
    counter,
    isRuined,
    edgeZoneTime,
    edgeZoneRecord,
    config,
    handleImageClick,
    handleReset,
    resetConfig,
    updateConfig,
  };
};

const EdgeGame = () => {
  const {
    progress,
    counter,
    isRuined,
    edgeZoneTime,
    edgeZoneRecord,
    config,
    handleImageClick,
    handleReset,
    resetConfig,
    updateConfig,
  } = useEdgeGame();

  return (
    <div className="edge-game-main">
      <div className="edge-game-header-container">
        <Link to="/" className="edge-game-back-button">  Back to Wooferville</Link>
        <h1 className="edge-game-header">Eggplant Edgies</h1>
      </div>
      <div className="edge-game-container">
          <div className='left-panel'>
            <div className='stats-panel'>
              <p className="stats-label">Edge count: {counter}</p>
              <p className="stats-label">Edge zone record: {edgeZoneRecord}s</p>
              <p className="stats-label">Total edge zone time: {Math.floor(edgeZoneTime)}s</p>
            </div>
            <div className="settings-panel">
              <div className="settings-header">
                <h2>Settings</h2>
                <button className="reset-button" onClick={resetConfig}>Reset</button>
              </div>
                <label className="settings-label">Tease<input step="5" type="number" placeholder={config.TEASE_ZONE_MAX} className="settings-input" /></label>
                <label className="settings-label">Edge<input step="5" type="number" placeholder={config.EDGE_ZONE_MAX} className="settings-input" /></label>
                <label className="settings-label">Incrememnt<input step="5" type="number" placeholder={config.INCREMENT} className="settings-input" /></label>
                <label className="settings-label">Decrement<input step="5" type="number" placeholder={config.DECREMENT} className="settings-input" /></label>
                <label className="settings-label">Tease Zone Decay (ms)<input step="5" type="number" placeholder={config.TEASE_DECAY_INTERVAL} className="settings-input" /></label>
                <label className="settings-label">Edge Zone Decay (ms)<input step="5" type="number" placeholder={config.EDGE_DECAY_INTERVAL} className="settings-input" /></label>
            </div>
          </div>
        <div className="game-area">
          {isRuined ? (
            <>
              <p className="ruined-text">You ruined the eggplant! 😭</p>
              <button className="play-again-button" onClick={handleReset}>Play again</button>
            </>
          ) : (
            <img src={eggplantImage} alt="Eggplant" onClick={handleImageClick} className="eggplant-image" />
          )}
          <div className="progress-bar-container">
            <div className="progress-fill" style={{ width: `${progress}%`, backgroundColor: isRuined ? '#FDA498' : '#5BCF91' }}></div>
            <img src={eggplantImage} alt="Marker" className="progress-marker" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EdgeGame;
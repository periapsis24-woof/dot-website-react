import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './EdgeGame.css';
import eggplantImage from '../assets/eggplant.png';
import GAME_CONFIG from '../utils/gameConfig';
import { url } from 'react';

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
  const [wiggleClass, setWiggleClass] = useState('');

  useEffect(() => {
    localStorage.setItem('edgeGameConfig', JSON.stringify(config));
  }, [config]);

  const handleImageClick = () => {
    const now = Date.now();
    setLastClickTime(now);
    setProgress((prev) => {
      const newProgress = prev + (Number(config.INCREMENT) || 0);
      console.log('New progress:', newProgress);
      if (newProgress >= (Number(config.CUM_ZONE_MIN) || 100)) {
        setIsRuined(true);
        return Math.min(newProgress, 100);
      }
      return Math.min(newProgress, 100);
    });

    let newWiggle = 'wiggle-low';
    if (progress >= (Number(config.EDGE_ZONE_MIN) || 60) && progress < (Number(config.EDGE_ZONE_MAX) || 94)) {
      newWiggle = 'wiggle-medium';
    } else if (progress >= (Number(config.EDGE_ZONE_MAX) || 94)) {
      newWiggle = 'wiggle-high';
    }
    setWiggleClass(newWiggle);
    setTimeout(() => setWiggleClass(''), 300);
  };

  const handleReset = () => {
    setProgress(config.INITIAL_PROGRESS);
    setCounter(0);
    setHasReachedThreshold(false);
    setIsRuined(false);
    setEdgeZoneTime(0);
    setTickCount(0);
    setLastClickTime(null);
    setWiggleClass('');
    setEdgeZoneRecord(Math.round(edgeZoneTime));
  };

  const resetConfig = () => {
    setConfig(GAME_CONFIG);
  };

  const updateConfig = (key, value) => {
    if (value === '') {
      setConfig((prev) => ({
        ...prev,
        [key]: '',
      }));
      return;
    }

    const numValue = Number(value);
    if (isNaN(numValue)) return;

    let validatedValue = numValue;
    if (key === 'TEASE_ZONE_MAX' || key === 'EDGE_ZONE_MAX' || key === 'CUM_ZONE_MIN') {
      validatedValue = Math.min(Math.max(numValue, 0), 100);
    } else if (key === 'INCREMENT' || key === 'DECREMENT' || key.includes('DECAY_INTERVAL')) {
      validatedValue = Math.max(numValue, 1);
    }

    setConfig((prev) => ({
      ...prev,
      [key]: validatedValue,
    }));
  };

  useEffect(() => {
    if (isRuined) return;
    const interval = setInterval(() => {
      setTickCount((prev) => prev + 1);
      if (progress >= (Number(config.EDGE_ZONE_MIN) || 60) && progress <= (Number(config.EDGE_ZONE_MAX) || 94) && lastClickTime && Date.now() - lastClickTime < 1000) {
        setEdgeZoneTime((prev) => prev + 0.01);
      }
      if (progress <= (Number(config.TEASE_ZONE_MAX) || 59) && tickCount % ((Number(config.TEASE_DECAY_INTERVAL) || 500) / 10) === 0) {
        setProgress((prev) => {
          if (lastClickTime && Date.now() - lastClickTime < (Number(config.TEASE_DECAY_INTERVAL) || 500)) return prev;
          return Math.max(prev - (Number(config.DECREMENT) || 1), 0);
        });
      }
      if (progress >= (Number(config.EDGE_ZONE_MIN) || 60) && progress <= (Number(config.EDGE_ZONE_MAX) || 94) && tickCount % ((Number(config.EDGE_DECAY_INTERVAL) || 200) / 10) === 0) {
        setProgress((prev) => {
          if (lastClickTime && Date.now() - lastClickTime < (Number(config.EDGE_DECAY_INTERVAL) || 200)) return prev;
          return Math.max(prev - (Number(config.DECREMENT) || 1), 0);
        });
      }
    }, 10);
    return () => clearInterval(interval);
  }, [progress, tickCount, lastClickTime, config, isRuined]);

  useEffect(() => {
    if (progress >= (Number(config.EDGE_ZONE_MIN) || 60) && !hasReachedThreshold && !isRuined) {
      setCounter((prev) => prev + 1);
      setHasReachedThreshold(true);
    } else if (progress < (Number(config.EDGE_ZONE_MIN) || 60)) {
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
    wiggleClass,
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
    wiggleClass,
  } = useEdgeGame();

  const teaseZoneMax = Number(config.TEASE_ZONE_MAX) || 0;
  const edgeZoneMax = Number(config.EDGE_ZONE_MAX) || 0;
  const cumZoneMin = Number(config.CUM_ZONE_MIN) || 0;

  return (
    <div className="edge-game-main">
      <div className="edge-game-header-container">
        <Link to="/" className="edge-game-back-button"> Back to Wooferville</Link>
        <h1 className="edge-game-header">Eggplant Edgies</h1>
      </div>
      <div className="edge-game-container">
        <div className='left-panel'>
          <div className='stats-panel'>
            <p className="stats-label">Edge count: <span className="stats-value">{counter}</span></p>
            <p className="stats-label">Edge zone record: <span className="stats-value">{edgeZoneRecord}s</span></p>
            <p className="stats-label">Total edge zone time: <span className="stats-value">{Math.floor(edgeZoneTime)}s</span></p>
          </div>
          <div className="settings-panel">
            <div className="settings-header">
              <h2>Settings</h2>
              <button className="reset-button" onClick={resetConfig}>Reset</button>
            </div>
            <label className="settings-label">Tease<input 
              type="number" 
              value={config.TEASE_ZONE_MAX || ''} 
              onChange={(e) => updateConfig('TEASE_ZONE_MAX', e.target.value)} 
              className="settings-input" 
            /></label>
            <label className="settings-label">Edge<input 
              type="number" 
              value={config.EDGE_ZONE_MAX || ''} 
              onChange={(e) => updateConfig('EDGE_ZONE_MAX', e.target.value)} 
              className="settings-input" 
            /></label>
            <label className="settings-label">Increment<input 
              type="number" 
              value={config.INCREMENT || ''} 
              onChange={(e) => updateConfig('INCREMENT', e.target.value)} 
              className="settings-input" 
            /></label>
            <label className="settings-label">Decrement<input 
              type="number" 
              value={config.DECREMENT || ''} 
              onChange={(e) => updateConfig('DECREMENT', e.target.value)} 
              className="settings-input" 
            /></label>
            {/* <label className="settings-label">Tease Zone Decay (ms)<input 
              type="number" 
              value={config.TEASE_DECAY_INTERVAL || ''} 
              onChange={(e) => updateConfig('TEASE_DECAY_INTERVAL', e.target.value)} 
              className="settings-input" 
            /></label>
            <label className="settings-label">Edge Zone Decay (ms)<input 
              type="number" 
              value={config.EDGE_DECAY_INTERVAL || ''} 
              onChange={(e) => updateConfig('EDGE_DECAY_INTERVAL', e.target.value)} 
              className="settings-input" 
            /></label> */}
          </div>
        </div>
        <div className="game-area custom-cursor">
          {isRuined ? (
            <>
              <p className="ruined-text">You ruined the eggplant! 😭</p>
              <button className="play-again-button" onClick={handleReset}>Play again</button>
            </>
          ) : (
            <img 
              src={eggplantImage} 
              alt="Eggplant" 
              onClick={handleImageClick} 
              className={`eggplant-image ${wiggleClass}`} 
            />
          )}
          <div className="progress-wrapper">
            <div 
              className="progress-bar-container" 
              style={{
                background: `linear-gradient(to right, 
                  #C4F4DA 0%, 
                  #C4F4DA ${teaseZoneMax}%, 
                  #5BCF91 ${teaseZoneMax + 1}%, 
                  #5BCF91 ${edgeZoneMax}%, 
                  #FDA498 ${edgeZoneMax + 1}%, 
                  #FDA498 100%)`
              }}
            ></div>
            <img 
              src={eggplantImage} 
              alt="Progress Marker" 
              className="progress-marker" 
              style={{ left: `calc(${progress}% - ${50 / 2}px)` }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EdgeGame;
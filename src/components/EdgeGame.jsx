import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './EdgeGame.css';
import peachImage from '../assets/peach.png';
import eggplantImage from '../assets/eggplant.png';

const EdgeGame = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [counter, setCounter] = useState(0);
  const [hasReachedThreshold, setHasReachedThreshold] = useState(false);
  const [isRuined, setIsRuined] = useState(false);
  const [clickKey, setClickKey] = useState(0);
  const [darkThreshold, setDarkThreshold] = useState(75);
  const [edgeZoneTime, setEdgeZoneTime] = useState(0);
  const [subbySaves, setSubbySaves] = useState(3);

  const handleImageToggle = (image) => {
    setSelectedImage(selectedImage === image ? null : image);
    setProgress(0);
    setCounter(selectedImage === image ? 0 : counter);
    setHasReachedThreshold(false);
    setIsRuined(false);
    setDarkThreshold(75);
    setEdgeZoneTime(0);
    setSubbySaves(3);
  };

  const handleImageClick = () => {
    setProgress((prev) => {
      const increment = prev < 50 ? 5 : 10;
      const newProgress = prev + increment;
      if (newProgress > 100 && subbySaves > 0) {
        setSubbySaves((prevSaves) => Math.max(prevSaves - 1, 0));
        return Number(75..toFixed(1));
      }
      return Number(Math.min(newProgress, 100).toFixed(1));
    });
    setClickKey((prev) => prev + 1);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setProgress(0);
    setCounter(0);
    setHasReachedThreshold(false);
    setIsRuined(false);
    setDarkThreshold(75);
    setEdgeZoneTime(0);
    setSubbySaves(3);
  };

  useEffect(() => {
    if (!selectedImage || isRuined) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const decrement = prev >= darkThreshold ? 2 - counter * 0.25 : 3 - counter * 0.25;
        return Number(Math.max(prev - Math.max(decrement, 0), 0).toFixed(1));
      });
    }, 500);

    return () => clearInterval(interval);
  }, [selectedImage, isRuined, darkThreshold, counter]);

  useEffect(() => {
    if (!selectedImage || isRuined) return;

    const interval = setInterval(() => {
      setDarkThreshold((prev) => Number(Math.max(prev - 0.5, 75).toFixed(1)));
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedImage, isRuined]);

  useEffect(() => {
    if (!selectedImage || isRuined || progress < darkThreshold) return;

    const interval = setInterval(() => {
      setEdgeZoneTime((prev) => prev + 0.01);
    }, 10);

    return () => clearInterval(interval);
  }, [selectedImage, isRuined, progress, darkThreshold]);

  useEffect(() => {
    if (progress >= darkThreshold && !hasReachedThreshold && !isRuined) {
      setCounter((prev) => prev + 1);
      setHasReachedThreshold(true);
      setDarkThreshold((prev) => Number(Math.min(prev + 5, 100).toFixed(1)));
    } else if (progress < darkThreshold) {
      setHasReachedThreshold(false);
    }
  }, [progress, hasReachedThreshold, isRuined, darkThreshold]);

  useEffect(() => {
    if (progress >= 100 && subbySaves === 0) {
      setIsRuined(true);
      setEdgeZoneTime((prev) => prev);
    }
  }, [progress, subbySaves]);

  const formatTime = () => {
    const seconds = Math.floor(edgeZoneTime);
    const milliseconds = Math.round((edgeZoneTime - seconds) * 100);
    return `${seconds}.${milliseconds.toString().padStart(2, '0')}s`;
  };

  const getWiggleClass = () => {
    if (progress >= 75) return 'wiggle-high';
    if (progress >= 50) return 'wiggle-medium';
    return 'wiggle-low';
  };

  return (
    <>
      <header>
        <h1>...edgies?? EDGIES!!!</h1>
      </header>
      <main>
        {!selectedImage && (
          <>
            <p className="welcome-text">Welcome to Boss Dot's fun lil edging game!!</p>
            <p className="welcome-text">pick a plant:</p>
          </>
        )}
        <div className="button-group">
          <button
            className="nav-button"
            onClick={() => handleImageToggle('peach')}
            aria-label="Show or hide peach image"
          >
            Peach
          </button>
          <button
            className="nav-button"
            onClick={() => handleImageToggle('eggplant')}
            aria-label="Show or hide eggplant image"
          >
            Eggplant
          </button>
        </div>
        {selectedImage && (
          <div className="image-container">
            {isRuined ? (
              <>
                <p className="ruined-text">R U I N E D</p>
                <img
                  src={selectedImage === 'peach' ? peachImage : eggplantImage}
                  alt={selectedImage === 'peach' ? 'Peach' : 'Eggplant'}
                  className="centered-image"
                />
                <p className="counter">Edge Count: {counter}</p>
                <p className="timer">Edge Time: {formatTime()}</p>
                <p className="subby-saves">Subby Saves: {subbySaves}</p>
                <button
                  className="nav-button reset-button"
                  onClick={handleReset}
                  aria-label="Reset game"
                >
                  Reset Game
                </button>
              </>
            ) : (
              <>
                <img
                  src={selectedImage === 'peach' ? peachImage : eggplantImage}
                  alt={selectedImage === 'peach' ? 'Peach' : 'Eggplant'}
                  className={`centered-image ${getWiggleClass()}`}
                  onClick={handleImageClick}
                  role="button"
                  aria-label={`Click to progress ${selectedImage === 'peach' ? 'peach' : 'eggplant'} meter`}
                  key={clickKey}
                />
                <div className="stats-container">
                  <p className="counter">Edge Count: {counter}</p>
                  <p className="timer">Edge Time: {formatTime()}</p>
                </div>
                <p className="subby-saves">Subby Saves: {subbySaves}</p>
                <div
                  className="progress-bar"
                  style={{ '--threshold': `${darkThreshold}%`, '--progress': `${progress}%` }}
                >
                  <div
                    className={`progress-fill ${progress >= darkThreshold ? 'progress-fill-dark' : ''}`}
                    style={{ width: `${progress}%` }}
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-label="Progress for selected image"
                  />
                  <div className="progress-marker" />
                  <img
                    src={selectedImage === 'peach' ? peachImage : eggplantImage}
                    alt="Progress marker"
                    className="progress-current-marker"
                  />
                </div>
              </>
            )}
          </div>
        )}
      </main>
      <div className="back-button-container">
        <Link to="/" className="nav-button">
          Back to Bark-O-Meter
        </Link>
      </div>
      <footer>
        <p>© 2025 Boss' Puppy Programmer ໒(＾ᴥ＾)７</p>
      </footer>
    </>
  );
};

export default EdgeGame;
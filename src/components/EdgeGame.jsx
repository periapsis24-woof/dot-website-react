import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './EdgeGame.css';
import peachImage from '../assets/peach.png';
import eggplantImage from '../assets/eggplant.png';
import GAME_CONFIG from '../utils/gameConfig';

// all the game logic lives here
const useEdgeGame = () => {
  // set up all the crap we need to track haha <3
  const [selectedImage, setSelectedImage] = useState(null);
  const [progress, setProgress] = useState(GAME_CONFIG.INITIAL_PROGRESS);
  const [counter, setCounter] = useState(0);
  const [hasReachedThreshold, setHasReachedThreshold] = useState(false);
  const [isRuined, setIsRuined] = useState(false);
  const [clickKey, setClickKey] = useState(0);
  const [darkThreshold] = useState(GAME_CONFIG.THRESHOLD);
  const [edgeZoneTime, setEdgeZoneTime] = useState(0);
  const [subbySaves, setSubbySaves] = useState(GAME_CONFIG.INITIAL_SUBBY_SAVES);
  const [tickCount, setTickCount] = useState(0);
  const [edgeZoneEntryTime, setEdgeZoneEntryTime] = useState(null);
  const [lastClickTime, setLastClickTime] = useState(null);
  const [tooFast, setTooFast] = useState(false);
  const [edgeZoneClicks, setEdgeZoneClicks] = useState(0);

  // toggle peach or eggplant, reset everything
  const handleImageToggle = (image) => {
    setSelectedImage(selectedImage === image ? null : image);
    setProgress(GAME_CONFIG.INITIAL_PROGRESS);
    setCounter(selectedImage === image ? 0 : counter);
    setHasReachedThreshold(false);
    setIsRuined(false);
    setEdgeZoneTime(0);
    setSubbySaves(GAME_CONFIG.INITIAL_SUBBY_SAVES);
    setTickCount(0);
    setEdgeZoneEntryTime(null);
    setLastClickTime(null);
    setTooFast(false);
    setEdgeZoneClicks(0);
  };

  // handle clicks on the image, lotsa logic here!!!!
  const handleImageClick = () => {
    const now = Date.now();
    // check if clicking too fast in red zone, show warning <3
    if (lastClickTime && now - lastClickTime < GAME_CONFIG.TOO_FAST_THRESHOLD && progress >= GAME_CONFIG.RED_ZONE_THRESHOLD) {
      setTooFast(true);
      setTimeout(() => setTooFast(false), 1000);
    }
    setLastClickTime(now);
    // update progress based on where you are
    setProgress((prev) => {
      const isInEdgeZone = prev >= darkThreshold;
      // track clicks in edge zone
      if (isInEdgeZone) setEdgeZoneClicks((prevClicks) => prevClicks + 1);
      const timeInEdgeZone = isInEdgeZone && edgeZoneEntryTime ? now - edgeZoneEntryTime : 0;
      // set increment based on progress and edge zone timing
      const baseIncrement = prev < 50 ? GAME_CONFIG.INCREMENT_LOW :
        isInEdgeZone ? GAME_CONFIG.INCREMENT_EDGE_ZONE - (timeInEdgeZone / GAME_CONFIG.EDGE_ZONE_DECAY_TIME) * (GAME_CONFIG.INCREMENT_EDGE_ZONE - GAME_CONFIG.INCREMENT_EDGE_MIN) :
        GAME_CONFIG.INCREMENT_HIGH;
      // bigger jump if too fast or more edge zone clicks
      const increment = isInEdgeZone && tooFast ? GAME_CONFIG.INCREMENT_TOO_FAST :
        isInEdgeZone ? baseIncrement + edgeZoneClicks * GAME_CONFIG.EDGE_ZONE_INCREMENT_STEP :
        baseIncrement;
      const newProgress = prev + Math.max(increment, GAME_CONFIG.INCREMENT_EDGE_MIN);
      // use subby save if would ruin
      if (newProgress > 100 && subbySaves > 0) {
        setSubbySaves((prevSaves) => Math.max(prevSaves - 1, 0));
        setEdgeZoneClicks(0);
        return Number((GAME_CONFIG.SUBBY_SAVE_PROGRESS).toFixed(1));
      }
      return Number(Math.min(newProgress, 100).toFixed(1));
    });
    // track total clicks
    setClickKey((prev) => prev + 1);
  };

  // reset everything when user wants to start over if theyve already played!!!
  const handleReset = () => {
    setSelectedImage(null);
    setProgress(GAME_CONFIG.INITIAL_PROGRESS);
    setCounter(0);
    setHasReachedThreshold(false);
    setIsRuined(false);
    setEdgeZoneTime(0);
    setSubbySaves(GAME_CONFIG.INITIAL_SUBBY_SAVES);
    setTickCount(0);
    setEdgeZoneEntryTime(null);
    setLastClickTime(null);
    setTooFast(false);
    setEdgeZoneClicks(0);
  };

  // main game loop, runs every 10ms
  useEffect(() => {
    if (!selectedImage || isRuined) return;
    const interval = setInterval(() => {
      // tick counter for timing
      setTickCount((prev) => prev + 1);
      // edge zone timer only if recent click
      if (progress >= darkThreshold && lastClickTime && Date.now() - lastClickTime < 1000) {
        setEdgeZoneTime((prev) => prev + 0.01);
        if (!edgeZoneEntryTime) setEdgeZoneEntryTime(Date.now());
      } else if (edgeZoneEntryTime) {
        setEdgeZoneEntryTime(null);
        setEdgeZoneClicks(0);
      }
      // update progress every 500ms
      if (tickCount % (GAME_CONFIG.DECREMENT_INTERVAL / 10) === 0) {
        setProgress((prev) => {
          const decrement = prev >= darkThreshold ? GAME_CONFIG.DECREMENT_EDGE_ZONE : GAME_CONFIG.DECREMENT_OUTSIDE;
          return Number(Math.max(prev - Math.max(decrement, GAME_CONFIG.MIN_DECREMENT), 0).toFixed(1));
        });
      }
    }, 10);
    return () => clearInterval(interval);
  }, [selectedImage, isRuined, progress, darkThreshold, tickCount, edgeZoneEntryTime, lastClickTime]);

  // check for edge zone crossing
  useEffect(() => {
    const roundedProgress = Number(progress.toFixed(1));
    if (roundedProgress >= darkThreshold && !hasReachedThreshold && !isRuined) {
      setCounter((prev) => prev + 1);
      setHasReachedThreshold(true);
    } else if (roundedProgress < darkThreshold) {
      setHasReachedThreshold(false);
    }
  }, [progress, hasReachedThreshold, isRuined, darkThreshold]);

  // check for ruin condition
  useEffect(() => {
    if (progress >= 100 && subbySaves === 0) {
      setIsRuined(true);
      setEdgeZoneTime((prev) => prev);
      setEdgeZoneClicks(0);
    }
  }, [progress, subbySaves]);

  // format timer to nearest second
  const formatTime = () => {
    const seconds = Math.round(edgeZoneTime);
    return `${seconds}s`;
  };

  // set ~ jiggle giggle wiggle ~  animation based on progress
  const getWiggleClass = () => {
    if (progress >= 75) return 'wiggle-high';
    if (progress >= 50) return 'wiggle-medium';
    return 'wiggle-low';
  };

  // return all the good stuff for the component
  return {
    selectedImage,
    progress,
    counter,
    edgeZoneTime,
    subbySaves,
    isRuined,
    clickKey,
    darkThreshold,
    tooFast,
    handleImageToggle,
    handleImageClick,
    handleReset,
    formatTime,
    getWiggleClass,
  };
};

// main component for the game!
const EdgeGame = () => {
  // grab all the game state and what not
  const {
    selectedImage,
    progress,
    counter,
    edgeZoneTime,
    subbySaves,
    isRuined,
    clickKey,
    darkThreshold,
    tooFast,
    handleImageToggle,
    handleImageClick,
    handleReset,
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
        {/* buttons to pick peach or eggplant */}
        <div className="button-group">
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
        </div>
        {/* game content when image is selected */}
        {selectedImage && (
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
                <p className="subby-saves">subby saves: {subbySaves}</p>
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
                <div className="stats-container">
                  <p className="counter">edge count: {counter}</p>
                  <p className="timer">edge time: {formatTime()}</p>
                  {tooFast && <p className="too-fast">too fast!</p>}
                </div>
                <p className="subby-saves">subby saves: {subbySaves}</p>
                {/* progress bar with markers */}
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
                    aria-label="progress for selected image"
                  />
                  <div className="progress-marker" />
                  <img
                    src={selectedImage === 'peach' ? peachImage : eggplantImage}
                    alt="progress marker"
                    className="progress-current-marker"
                  />
                </div>
              </>
            )}
          </div>
        )}
      </main>
      {/* back to bark-o-meter link */}
      <div className="back-button-container">
        <Link to="/" className="nav-button">
          Back to Bark-O-Meter
        </Link>
      </div>
      <footer>
        <p>© 2025 boss' puppy programmer ໒(＾ᴥ＾)７</p>
      </footer>
    </>
  );
};

export default EdgeGame;
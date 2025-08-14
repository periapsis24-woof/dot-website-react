import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';
import peachImage from '../assets/peach.png';
import eggplantImage from '../assets/eggplant.png';

const EdgeGame = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [counter, setCounter] = useState(0);
  const [hasReachedThreshold, setHasReachedThreshold] = useState(false);
  const [isRuined, setIsRuined] = useState(false);

  const handleImageToggle = (image) => {
    setSelectedImage(selectedImage === image ? null : image);
    setProgress(selectedImage === image ? 0 : 0);
    setCounter(selectedImage === image ? 0 : counter);
    setHasReachedThreshold(false);
    setIsRuined(false);
  };

  const handleImageClick = () => {
    setProgress((prev) => Math.min(prev + 10, 100));
  };

  useEffect(() => {
    if (!selectedImage || isRuined) return;

    const interval = setInterval(() => {
      setProgress((prev) => Math.max(prev - 2, 0));
    }, 500);

    return () => clearInterval(interval);
  }, [selectedImage, isRuined]);

  useEffect(() => {
    if (progress >= 75 && !hasReachedThreshold && !isRuined) {
      setCounter((prev) => prev + 1);
      setHasReachedThreshold(true);
    } else if (progress < 75) {
      setHasReachedThreshold(false);
    }
  }, [progress, hasReachedThreshold, isRuined]);

  useEffect(() => {
    if (progress === 100) {
      setIsRuined(true);
      const timeout = setTimeout(() => {
        setSelectedImage(null);
        setProgress(0);
        setCounter(0);
        setHasReachedThreshold(false);
        setIsRuined(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [progress]);

  return (
    <>
      <header>
        <h1>...edgies?? EDGIES!!!</h1>
      </header>
      <main>
        {!selectedImage && (
          <>
            <p>Welcome to Boss Dot's fun lil edging game!!</p>
            <p>pick a plant:</p>
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
              <p className="ruined-text">R U I N E D</p>
            ) : (
              <>
                <img 
                  src={selectedImage === 'peach' ? peachImage : eggplantImage} 
                  alt={selectedImage === 'peach' ? 'Peach' : 'Eggplant'} 
                  className="centered-image"
                  onClick={handleImageClick}
                  role="button"
                  aria-label={`Click to progress ${selectedImage === 'peach' ? 'peach' : 'eggplant'} meter`}
                />
                <p className="counter">Edge Count: {counter}</p>
                <div className="progress-bar">
                  <div 
                    className={`progress-fill ${progress >= 75 ? 'progress-fill-dark' : ''}`}
                    style={{ width: `${progress}%` }}
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-label="Progress for selected image"
                  ></div>
                </div>
              </>
            )}
          </div>
        )}
      </main>
      <div className="back-button-container">
        <Link to="/" className="nav-button">Back to Bark-O-Meter</Link>
      </div>
      <footer>
        <p>© 2025 Boss' Puppy Programmer ໒(＾ᴥ＾)７</p>
      </footer>
    </>
  );
};

export default EdgeGame;
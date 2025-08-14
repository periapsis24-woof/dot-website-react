import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';

const BarkOMeter = () => {
  const [count, setCount] = useState(null);
  const [error, setError] = useState(null);
  const snd = new Audio('/woof3.m4a');

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch('/.netlify/functions/counter');
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        setCount(data.count);
      } catch (err) {
        console.error('Fetch error:', err.message);
        setError('Error');
      }
    };
    fetchCount();
  }, []);

  const handleIncrement = async () => {
    try {
      const response = await fetch('/.netlify/functions/counter', {
        method: 'POST',
      });
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setCount(data.count);
      const countDisplay = document.getElementById('visitor-count');
      countDisplay.classList.add('updated');
      snd.play();
      snd.currentTime = 0;
      setTimeout(() => countDisplay.classList.remove('updated'), 300);
    } catch (err) {
      console.error('Increment error:', err.message);
      setError('Error');
      snd.play();
      snd.currentTime = 0;
    }
  };

  return (
    <>
      <header id="header">
        <h1>Boss Dot's Bark-O-Meter</h1>
      </header>
      <main>
        <p>Total Woofs: <span id="visitor-count">{error || count || 'Loading...'}</span></p>
        <div id="button-grid">
          <button id="increment-button" onClick={handleIncrement}>
            w o o f ! ! ໒(＾ᴥ＾)७
          </button>
          <Link to="/edgegame" className="nav-button">
            Edgies!
          </Link>
        </div>
      </main>
      <footer>
        <p>© 2025 Boss' Puppy Programmer ໒(＾ᴥ＾)७</p>
      </footer>
    </>
  );
};

export default BarkOMeter;
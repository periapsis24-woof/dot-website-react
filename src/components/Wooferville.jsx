import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Wooferville.css';

const Wooferville = () => {
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
      <header>
        <h1>Welcome to Wooferville!</h1>
      </header>
      <div className="content">
        <p className="population">Population: <span id="visitor-count">{error || count || 'Loading...'}</span> woofs</p>
        <div className='button-container'>
            <div className="button-group"> 
                <button className="button puppy-button" onClick={handleIncrement}>
                    ໒(＾ᴥ＾)७
                </button>
                <Link to="/EdgeGame" className="button eggplant-button">
                    Eggplant Edgies
                </Link>
            </div>
        </div>
      </div>
    </>
  );
};

export default Wooferville;
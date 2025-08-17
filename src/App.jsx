// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Wooferville from './components/Wooferville';
import EdgeGame from './components/EdgeGame';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Wooferville />} />
        <Route path="/edgegame" element={<EdgeGame />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
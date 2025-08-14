import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BarkOMeter from './components/BarkOMeter';
import EdgeGame from './components/EdgeGame';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BarkOMeter />} />
        <Route path="/edgegame" element={<EdgeGame />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
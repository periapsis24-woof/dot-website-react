import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BarkOMeter from './components/BarkOMeter';
import About from './components/About';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BarkOMeter />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
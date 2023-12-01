import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SelectRoom from './components/SelectRoom';
import Room from './components/Room';

import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<SelectRoom />}></Route>
          <Route path="/:roomName" element={<Room />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;

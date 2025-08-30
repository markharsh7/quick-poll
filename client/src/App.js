import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreatePage from './pages/CreatePage';
import VotePage from './pages/VotePage';
import ResultsPage from './pages/ResultsPage';
import './index.css';

function App() {
  return (
    <Router>
      <div className="glass-container">
        <Routes>
          <Route path="/" element={<CreatePage />} />
          <Route path="/poll/:pollId/vote" element={<VotePage />} />
          <Route path="/poll/:pollId/results" element={<ResultsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

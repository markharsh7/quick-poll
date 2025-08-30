import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const API_URL = process.env.REACT_APP_API_URL;

function VotePage() {
  const [poll, setPoll] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const { pollId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const votedPolls = JSON.parse(localStorage.getItem('votedPolls') || '[]');
    if (votedPolls.includes(pollId)) {
      setHasVoted(true);
      navigate(`/poll/${pollId}/results`);
      return;
    }

    axios.get(`${API_URL}/api/polls/${pollId}`)
      .then(res => setPoll(res.data))
      .catch(err => {
        console.error(err);
        alert('Poll not found or has expired.');
        navigate('/');
      });
  }, [pollId, navigate]);

  const handleVote = (optionId) => {
    const socket = io(API_URL);
    socket.emit('vote', { pollId, optionId });
    const votedPolls = JSON.parse(localStorage.getItem('votedPolls') || '[]');
    votedPolls.push(pollId);
    localStorage.setItem('votedPolls', JSON.stringify(votedPolls));
    navigate(`/poll/${pollId}/results`);
  };

  if (!poll || hasVoted) {
    return <h2>Loading Poll...</h2>;
  }

  return (
    <div>
      <h2>{poll.question}</h2>
      <div className="vote-options-container">
        {poll.options.map(option => (
          <button key={option._id} className="option-button" onClick={() => handleVote(option._id)}>
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
}

export default VotePage;
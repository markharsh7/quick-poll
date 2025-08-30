import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const API_URL = process.env.REACT_APP_API_URL;
const socket = io(API_URL);

function VotePage() {
  const [poll, setPoll] = useState(null);
  const { pollId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_URL}/api/polls/${pollId}`)
      .then(res => setPoll(res.data))
      .catch(err => {
        console.error(err);
        alert('Poll not found or has expired.');
        navigate('/');
      });
  }, [pollId, navigate]);

  const handleVote = (optionId) => {
    socket.emit('vote', { pollId, optionId });
    navigate(`/poll/${pollId}/results`);
  };

  if (!poll) return <h2>Loading poll...</h2>;

  return (
    <div>
      <h2>{poll.question}</h2>
      {poll.options.map(option => (
        <button key={option._id} className="option-button" onClick={() => handleVote(option._id)}>
          {option.text}
        </button>
      ))}
    </div>
  );
}

export default VotePage;
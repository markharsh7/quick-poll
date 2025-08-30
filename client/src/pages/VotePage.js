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
    // Check if the user has already voted on this poll
    const votedPolls = JSON.parse(localStorage.getItem('votedPolls') || '[]');
    if (votedPolls.includes(pollId)) {
      setHasVoted(true);
      // If they've already voted, just show them the results directly.
      navigate(`/poll/${pollId}/results`);
      return; // Stop execution to avoid fetching poll data
    }

    // If not voted, fetch the poll data
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

    // Store the pollId in localStorage to prevent future votes
    const votedPolls = JSON.parse(localStorage.getItem('votedPolls') || '[]');
    votedPolls.push(pollId);
    localStorage.setItem('votedPolls', JSON.stringify(votedPolls));

    // Redirect to results page
    navigate(`/poll/${pollId}/results`);
  };

  // While loading or if the user has already voted and is being redirected
  if (!poll || hasVoted) {
    return <h2>Loading...</h2>;
  }

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
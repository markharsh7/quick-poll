import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import io from 'socket.io-client';
import QRCode from "react-qr-code";

const API_URL = process.env.REACT_APP_API_URL;

function ResultsPage() {
  const [poll, setPoll] = useState(null);
  const [hasVoted, setHasVoted] = useState(false); // State to track voting status
  const { pollId } = useParams();
  const voteUrl = `${window.location.origin}/poll/${pollId}/vote`;

  useEffect(() => {
    // Check localStorage to see if the user has voted
    const votedPolls = JSON.parse(localStorage.getItem('votedPolls') || '[]');
    if (votedPolls.includes(pollId)) {
      setHasVoted(true);
    }

    const socket = io(API_URL);
    
    axios.get(`${API_URL}/api/polls/${pollId}`)
      .then(res => setPoll(res.data))
      .catch(err => console.error(err));

    socket.emit('join-poll', pollId);

    socket.on('results-updated', (updatedPoll) => {
      setPoll(updatedPoll);
    });

    return () => {
      socket.disconnect();
    };
  }, [pollId]);

  if (!poll) return <h2>Loading results...</h2>;

  const data = poll.options.map(option => ({
    name: option.text,
    votes: option.votes,
  }));

  return (
    <div>
      <h2>{poll.question}</h2>
      {hasVoted && <p style={{ color: '#27ae60', fontWeight: 'bold' }}>You have already voted in this poll.</p>}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="votes" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
      <h3>Share this poll!</h3>
      <p>
        {/* Conditionally render the link to prevent re-voting */}
        {!hasVoted && <Link to={`/poll/${pollId}/vote`}>Go to Voting Page</Link>}
      </p>
      <div className="qr-code-container">
        <QRCode value={voteUrl} size={128} />
      </div>
    </div>
  );
}

export default ResultsPage;
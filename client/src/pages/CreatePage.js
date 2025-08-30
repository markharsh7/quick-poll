import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

function CreatePage() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const navigate = useNavigate();

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const filteredOptions = options.filter(opt => opt.trim() !== '');
      if (question.trim() === '' || filteredOptions.length < 2) {
        alert('Please enter a question and at least two options.');
        return;
      }
      const res = await axios.post(`${API_URL}/api/polls`, { question, options: filteredOptions });
      navigate(`/poll/${res.data._id}/results`);
    } catch (error) {
      console.error('Error creating poll:', error);
    }
  };

  return (
    <div>
      <h1>Create a Real-Time Poll</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your poll question here..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
        <h3>Options</h3>
        {options.map((option, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Option ${index + 1}`}
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
          />
        ))}
        <div className="button-group">
            <button type="button" className="btn-secondary" onClick={addOption}>Add Option</button>
            <button type="submit" className="btn-primary">Create Poll</button>
        </div>
      </form>
    </div>
  );
}

export default CreatePage;
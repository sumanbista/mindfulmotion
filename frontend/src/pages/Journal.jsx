import React, { useState, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { motion } from 'framer-motion';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Journal.css';


const Journal = () => {
  const [entry, setEntry] = useState('');
  const [mood, setMood] = useState('');
  const [tags, setTags] = useState([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [calmMode, setCalmMode] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [journalEntries, setJournalEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Sample quotes
  const quotes = useMemo(
    () => [
      { text: "The present moment is filled with joy and happiness.", author: "Thich Nhat Hanh" },
      { text: "You are enough just as you are.", author: "Meghan Markle" },
      { text: "Peace begins with a smile.", author: "Mother Teresa" },
    ],
    []
  );
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Predefined prompts
  const prompts = useMemo(
    () => [
      "Today I’m grateful for…",
      "One challenge I faced and overcame…",
      "Something beautiful I saw today…",
    ],
    []
  );
  const [randomPrompt, setRandomPrompt] = useState(
    prompts[Math.floor(Math.random() * prompts.length)]
  );

  // Handle photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
    }
  };

  // Handle tag addition
  const addTag = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      setTags([...tags, e.target.value]);
      e.target.value = '';
    }
  };

  // Handle new quote
  const handleNewQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % quotes.length);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const journalEntry = {
      entry,
      mood,
      tags,
      isPrivate: true, // Always private
      photo,
      date: selectedDate,
    };
    setJournalEntries([...journalEntries, journalEntry]);
    setEntry('');
    setMood('');
    setTags([]);
    setPhoto(null);
    setRandomPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
  };

  // Filter entries by selected date
  const selectedEntry = journalEntries.find(
    (entry) => entry.date.toDateString() === selectedDate.toDateString()
  );

  return (
    <motion.div
      className={`journal-container ${calmMode ? 'calm-mode' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Quote of the Day */}
      <motion.div
        className="quote-section"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <p>"{quotes[quoteIndex].text}"</p>
        <small>- {quotes[quoteIndex].author}</small>
        <button className="new-quote-btn" onClick={handleNewQuote}>
          New Quote
        </button>
      </motion.div>


      {/* Daily Journal Entry */}
      <form onSubmit={handleSubmit}>
        <div className="journal-header">
          <h2>Daily Reflection</h2>
          <span className="lock-icon">🔒</span> {/* Always private */}
        </div>

        <motion.p className="prompt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          {randomPrompt}
        </motion.p>

        <ReactQuill
          value={entry}
          onChange={setEntry}
          modules={{ toolbar: [['bold', 'italic', 'underline']] }}
          placeholder="Write your thoughts here..."
          className="quill-editor"
        />

        <div className="mood-section">
          <label>Mood:</label>
          <div className="mood-icons">
            {['😊', '😐', '😢', '😠'].map((icon) => (
              <motion.span
                key={icon}
                className={`mood-icon ${mood === icon ? 'selected' : ''}`}
                whileHover={{ scale: 1.2 }}
                onClick={() => setMood(icon)}
              >
                {icon}
              </motion.span>
            ))}
          </div>
        </div>

        <div className="tags-section">
          <label>Tags:</label>
          <input
            type="text"
            placeholder="e.g., Gratitude, Stress (Press Enter)"
            onKeyDown={addTag}
          />
          <div className="tag-list">
            {tags.map((tag, index) => (
              <motion.span
                key={index}
                className="tag"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {tag}{' '}
                <button onClick={() => setTags(tags.filter((t) => t !== tag))}>×</button>
              </motion.span>
            ))}
          </div>
        </div>

        <div className="photo-section">
          <label>Attach a Moment:</label>
          <input type="file" accept="image/*" onChange={handlePhotoUpload} />
          {photo && (
            <motion.img
              src={photo}
              alt="Uploaded"
              className="uploaded-photo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}
        </div>

        <motion.button
          type="submit"
          className="submit-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Save Entry
        </motion.button>
      </form>

      {/* Calm Mode Toggle */}
      <div className="calm-mode-toggle">
        <label>Calm Mode:</label>
        <input
          type="checkbox"
          checked={calmMode}
          onChange={() => setCalmMode(!calmMode)}
        />
        {calmMode && (
          <motion.div
            className="breathing-animation"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            Breathe...
          </motion.div>
        )}
      </div>

      {/* Calendar and Past Entries */}
      <div className="journal-history">
        <h3>Your Journal</h3>
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          className="journal-calendar"
        />
        <div className="entry-display">
          {selectedEntry ? (
            <div className="entry-card">
              <p><strong>Date:</strong> {selectedEntry.date.toDateString()}</p>
              <p><strong>Mood:</strong> {selectedEntry.mood || 'Not set'}</p>
              <p><strong>Entry:</strong></p>
              <div dangerouslySetInnerHTML={{ __html: selectedEntry.entry }} />
              {selectedEntry.photo && (
                <img src={selectedEntry.photo} alt="Entry" className="entry-photo" />
              )}
              <p><strong>Tags:</strong> {selectedEntry.tags.join(', ') || 'None'}</p>
            </div>
          ) : (
            <p>No entry for {selectedDate.toDateString()}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Journal;
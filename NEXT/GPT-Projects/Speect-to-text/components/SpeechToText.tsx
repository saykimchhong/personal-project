'use client'
import React, { useState, useEffect } from 'react';

interface SpeechRecognition extends EventTarget {
  grammars: any;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  serviceURI: string;

  start(): void;
  stop(): void;
  abort(): void;

  onstart: (event: Event) => void;
  onend: (event: Event) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onnomatch: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionError) => void;
  onaudiostart: (event: Event) => void;
  onaudioend: (event: Event) => void;
  onsoundstart: (event: Event) => void;
  onsoundend: (event: Event) => void;
  onspeechstart: (event: Event) => void;
  onspeechend: (event: Event) => void;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionError extends Event {
  error: string;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

const SpeechToText: React.FC = () => {
  const [transcript, setTranscript] = useState<string>('');
  const [language, setLanguage] = useState<string>('en-US'); // Default to English

  // Declare the recognition variable here so that it's accessible within the entire component scope
  const recognition = new (window.SpeechRecognition || (window as any).webkitSpeechRecognition)() as SpeechRecognition;

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      // Handle the case where SpeechRecognition is not available
      console.error('SpeechRecognition is not available in your browser.');
      return;
    }

    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const newTranscript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('');

      setTranscript(newTranscript);
    };

    // Rest of the component code

  }, [language]); // Run this effect whenever the 'language' state changes

  const startListening = () => {
    recognition.start();
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    recognition.lang = newLanguage;
  };

  const languageOptions = [
    { value: 'en-US', label: 'English' },
    { value: 'th-TH', label: 'Thai' },
    // Add more language options as needed
  ];

  return (
    <div>
      <button onClick={startListening}>Start Listening</button>
      <p>Current Language:</p>
      <select value={language} onChange={handleLanguageChange}>
        {languageOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <br />
      {/* Use a textarea to display and allow editing of the transcript */}
      <textarea
        rows={4} // Set the number of visible rows
        cols={50} // Set the number of visible columns
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)} // Update the transcript on user input
      />
    </div>
  );
};

export default SpeechToText;


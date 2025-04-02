import React from 'react';
import Chatbot from './components/ChatBot'
import Navbar from './components/Navbar';
import Tablets from './components/Tablets';

const App = () => {
  return (
    <>
      <Chatbot/>
      <Navbar />
      <Tablets />
    </>
  );
};

export default App;
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaRobot, FaTimes } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import { BsEmojiSmile } from 'react-icons/bs';
import './ChatBot.css';
import OpenAI from "openai";

const ChatBot = () => {
  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: 'Welcome to Lexbot... Please enter your name to begin:', 
      sender: 'bot',
      timestamp: new Date(),
      isQuestion: true
    }
  ]);
  const lastSubmissionRef = useRef(null);
  const [username, setUsername] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [currentStep, setCurrentStep] = useState('get-name');
  const [currentComplaintType, setCurrentComplaintType] = useState(null);
  const [complaintData, setComplaintData] = useState({});
  const [isWaitingForGPTResponse, setIsWaitingForGPTResponse] = useState(false);
  const [isSubmittingComplaint, setIsSubmittingComplaint] = useState(false);
  const messagesEndRef = useRef(null);
  const messageIdRef = useRef(2);

  // Initialize OpenAI client
  const openai = new OpenAI({
    apiKey: "insert key", // Add your API key here
    dangerouslyAllowBrowser: true
  });

  const storeComplaint = async (complaintData) => {
    // Enhanced duplicate check
    if (lastSubmissionRef.current?.username === complaintData.username && 
        lastSubmissionRef.current?.incidentDateTime === complaintData.incidentDateTime &&
        Date.now() - lastSubmissionRef.current?.timestamp < 60000) { // 60-second window
      return { 
        success: false, 
        isDuplicate: true,
        message: "" // Empty message since we won't show it
      };
    }
    
    setIsSubmittingComplaint(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...complaintData,
          timestamp: Date.now() // Add current timestamp
        })
      });
  
      if (!response.ok) throw new Error('Network response was not ok');
  
      const result = await response.json();
      lastSubmissionRef.current = {
        ...complaintData,
        timestamp: Date.now()
      };
      return { ...result, isDuplicate: false };
    } catch (error) {
      console.error("Error storing complaint:", error);
      return { 
        success: false, 
        isDuplicate: false,
        message: 'Failed to store complaint' 
      };
    } finally {
      setIsSubmittingComplaint(false);
    }
  };

  // Validate date format
  const validateDate = (dateString) => {
    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4} (0[1-9]|1[0-2]):[0-5][0-9] (am|pm)$/i;
    return dateRegex.test(dateString.trim());
  };

  // Function to get GPT response
  const getGPTResponse = async (userQuestion) => {
    setIsWaitingForGPTResponse(true);
    
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a legal assistant specializing in cyber laws. Provide simple answers about cyber laws, generate links if needed, and offer quick access to legal sections. Break down legal jargon into plain language. Guide individuals on their legal rights and steps to take when facing cybercrimes. Keep responses concise (50-100 words) and focused on Indian cyber laws where applicable. Only answer for these topics. If off-topic comes, respond with 'This is not relevant to cyber laws.Tell indian section/penal codes if needed.Should be for indian country"
          },
          {
            role: "user",
            content: userQuestion
          }
        ],
        max_tokens: 200
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      return "I'm sorry, I couldn't process your request at the moment. Please try again later.";
    } finally {
      setIsWaitingForGPTResponse(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isWaitingForGPTResponse || isSubmittingComplaint) return;

    // Special validation for date field
    if (currentStep === 'collecting-complaint-details') {
      const lastBotMessage = [...messages].reverse().find(msg => 
        msg.sender === 'bot' && msg.questions
      );
      
      if (lastBotMessage?.currentQuestionIndex === 0) {
        if (!validateDate(inputValue)) {
          const errorMsg = {
            id: messageIdRef.current++,
            text: '⚠️ Please enter date in correct format: mm/dd/yyyy hh:mm am/pm\nExample: 01/15/2023 02:30 pm',
            sender: 'bot',
            timestamp: new Date(),
            isQuestion: false
          };
          setMessages(prev => [...prev, errorMsg]);
          setInputValue('');
          return;
        }
      }
    }

    const newUserMessage = {
      id: messageIdRef.current++,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      isQuestion: false
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');

    // If we're in the cyber laws question mode, process with GPT
    if (currentStep === 'cyber-laws-question') {
      const gptResponse = await getGPTResponse(inputValue);
      const botResponse = {
        id: messageIdRef.current++,
        text: gptResponse,
        sender: 'bot',
        timestamp: new Date(),
        isQuestion: false
      };
      setMessages(prev => [...prev, botResponse]);
      return;
    }
  };

  // Process bot responses
  const processResponse = useCallback(async (userInput) => {
    let botResponse = {};
    
    switch(currentStep) {
      case 'get-name': {
        setUsername(userInput);
        botResponse = {
          id: messageIdRef.current++,
          text: `Hello ${userInput}, please select how we can help you:`,
          sender: 'bot',
          options: [
            { text: 'FILE COMPLAINT', value: 'complaint' },
            { text: 'QUESTIONS ABOUT CYBER LAWS', value: 'laws' }
          ],
          timestamp: new Date(),
          isQuestion: true
        };
        setCurrentStep('main-options');
        break;
      }
        
      case 'main-options': {
        if (userInput === 'FILE COMPLAINT') {
          botResponse = {
            id: messageIdRef.current++,
            text: 'Please select the type of complaint:',
            sender: 'bot',
            options: [
              { text: 'WOMEN/CHILDREN RELATED CRIME', value: 'women-children' },
              { text: 'FINANCIAL FRAUD', value: 'financial' },
              { text: 'OTHER CYBER CRIME', value: 'other' }
            ],
            timestamp: new Date(),
            isQuestion: true
          };
          setCurrentStep('complaint-type');
        } else if (userInput === 'QUESTIONS ABOUT CYBER LAWS') {
          botResponse = {
            id: messageIdRef.current++,
            text: 'Please type your question about cyber laws and I will provide you with accurate information:',
            sender: 'bot',
            timestamp: new Date(),
            isQuestion: true
          };
          setCurrentStep('cyber-laws-question');
        }
        break;
      }

      case 'complaint-type': {
        setCurrentComplaintType(userInput);
        if (userInput === 'WOMEN/CHILDREN RELATED CRIME') {
          botResponse = {
            id: messageIdRef.current++,
            text: 'Please select the specific category:',
            sender: 'bot',
            options: [
              { text: 'RGR', value: 'rgr' },
              { text: 'Sexually abusive content', value: 'abusive-content' },
              { text: 'Obscene material', value: 'obscene-material' }
            ],
            timestamp: new Date(),
            isQuestion: true
          };
          setCurrentStep('category-selection');
        } else if (userInput === 'FINANCIAL FRAUD') {
          botResponse = {
            id: messageIdRef.current++,
            text: 'Please select the specific fraud type:',
            sender: 'bot',
            options: [
              { text: 'Aadhar Enabled Payment System (AEPS)', value: 'aeps' },
              { text: 'Fraud Call Vishing', value: 'vishing' },
              { text: 'Internet banking related fraud', value: 'internet-banking' },
              { text: 'UPI related Fraud', value: 'upi' },
              { text: 'Debit or credit card Fraud', value: 'card-fraud' }
            ],
            timestamp: new Date(),
            isQuestion: true
          };
          setCurrentStep('category-selection');
        } else if (userInput === 'OTHER CYBER CRIME') {
          botResponse = {
            id: messageIdRef.current++,
            text: 'Please select the specific cyber crime type:',
            sender: 'bot',
            options: [
              { text: 'Online and Social Media Related Crime', value: 'social-media' },
              { text: 'Hacking / Damage to computer system', value: 'hacking' },
              { text: 'Online Cyber Trafficking', value: 'trafficking' },
              { text: 'Ransomware', value: 'ransomware' },
              { text: 'Cyber Terrorism', value: 'terrorism' },
              { text: 'Any Other Cyber Crime', value: 'other' }
            ],
            timestamp: new Date(),
            isQuestion: true
          };
          setCurrentStep('category-selection');
        }
        break;
      }

      case 'category-selection': {
        setComplaintData(prev => ({
          ...prev,
          category: userInput
        }));
        
        const commonQuestions = [
          'Approximate date & time of Incident (mm/dd/yyyy hh:mm am/pm):',
          'Where did the incident occur?:',
          'Please provide any additional information about the incident:'
        ];

        // Ask first question immediately
        botResponse = {
          id: messageIdRef.current++,
          text: commonQuestions[0],
          sender: 'bot',
          questions: commonQuestions,
          currentQuestionIndex: 0,
          timestamp: new Date(),
          isQuestion: true
        };
        setCurrentStep('collecting-complaint-details');
        break;
      }

      case 'collecting-complaint-details': {
        const lastBotMessage = [...messages].reverse().find(msg => 
          msg.sender === 'bot' && msg.questions
        );
      
        if (!lastBotMessage) {
          botResponse = {
            id: messageIdRef.current++,
            text: 'Error: Could not find questions. Please start over.',
            sender: 'bot',
            timestamp: new Date(),
            isQuestion: false
          };
          break;
        }
      
        const currentQIndex = lastBotMessage.currentQuestionIndex;
        const totalQuestions = lastBotMessage.questions.length;
      
        // Store answer
        setComplaintData(prev => ({
          ...prev,
          [`q${currentQIndex}_answer`]: userInput
        }));
      
        // Ask next question or complete
        if (currentQIndex < totalQuestions - 1) {
          botResponse = {
            id: messageIdRef.current++,
            text: lastBotMessage.questions[currentQIndex + 1],
            sender: 'bot',
            questions: lastBotMessage.questions,
            currentQuestionIndex: currentQIndex + 1,
            timestamp: new Date(),
            isQuestion: true
          };
        } else {
          const referenceNumber = `CR${Math.floor(Math.random() * 9000 + 1000)}`;
          
          const complaintDocument = {
            username: username,
            complaintType: currentComplaintType,
            category: complaintData.category,
            incidentDateTime: complaintData.q0_answer,
            placeOfIncident: complaintData.q1_answer,
            additionalInfo: complaintData.q2_answer || 'NIL',
            referenceNumber: referenceNumber,
            createdAt: new Date(),
            timestamp: Date.now()
          };
      
          // Store complaint and get result
          const storageResponse = await storeComplaint(complaintDocument);
      
          // If duplicate, don't show any message
          if (storageResponse.isDuplicate) {
            setCurrentStep('completed');
            return;
          }
      
          const formattedDate = new Date().toLocaleString();
          let confirmationMessage;
      
          if (storageResponse.success) {
            confirmationMessage = 
              `✅ Complaint successfully recorded on: ${formattedDate}\n\n` +
              `USER NAME: ${username}\n` +
              `COMPLAINT DETAILS:\n` +
              `Type: ${currentComplaintType}\n` +
              `Sub-Category: ${complaintData.category}\n` +
              `\nIncident Date/Time: ${complaintData.q0_answer}\n` +
              `Place of Incident: ${complaintData.q1_answer}\n` +
              `Additional Information: ${complaintData.q2_answer || 'NIL'}\n\n` +
              `Thank you for reporting. Your complaint reference number is ${referenceNumber}.\n\n` +
              `Your complaint is recorded successfully in our database.`;
          } else {
            confirmationMessage = 
              `❌ Failed to record complaint: ${storageResponse.message}\n\n` +
              `Please try again later or contact support.`;
          }
      
          botResponse = {
            id: messageIdRef.current++,
            text: confirmationMessage,
            sender: 'bot',
            timestamp: new Date(),
            isQuestion: false,
            noSeparator: true
          };
          setCurrentStep('completed');
        }
        break;
      }

      case 'completed': {
        // Don't add any additional messages after completion
        return;
      }
        
      default: {
        botResponse = {
          id: messageIdRef.current++,
          text: 'Thank you for using our Cyber Crime Reporting service.',
          sender: 'bot',
          timestamp: new Date(),
          isQuestion: false
        };
      }
    }
    
    if (Object.keys(botResponse).length > 0) {
      setMessages(prev => [...prev, botResponse]);
    }
  }, [currentStep, messages, currentComplaintType, complaintData, username]);

  // Auto-scroll and process responses
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.sender === 'user' && currentStep !== 'cyber-laws-question') {
      setTimeout(() => {
        processResponse(lastMessage.text);
      }, 800);
    }
  }, [messages, processResponse, currentStep]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (optionText) => {
    setInputValue(optionText);
    const fakeEvent = { preventDefault: () => {} };
    handleSubmit(fakeEvent);
  };

  const formatTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chatbot-container">
      {!isOpen && (
        <div className="chatbot-button" onClick={toggleChat}>
          <FaRobot size={24} />
          <span className="tooltip">Report Cyber Crime</span>
        </div>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="header-content">
              <FaRobot size={20} className="bot-icon" />
              <h3 className="header-title">Cyber Crime Reporting</h3>
            </div>
            <button 
              className="close-button" 
              onClick={toggleChat}
              type="button"
              aria-label="Close chat"
            >
              <FaTimes size={18} />
            </button>
          </div>
          
          <div className="messages-container">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={message.sender === 'bot' ? 'bot-message-container' : 'user-message-container'}
              >
                <div>
                  <div className="message-time">
                    {formatTime(message.timestamp)}
                  </div>
                  <div className={`message-bubble ${message.sender === 'bot' ? 'bot-bubble' : 'user-bubble'} ${message.noSeparator ? 'no-separator' : ''}`}>
                    {message.text}
                    {message.options && (
                      <div className="options-container">
                        {message.options.map((option, index) => (
                          <button
                            key={`${message.id}-${index}`}
                            className="option-button"
                            onClick={() => handleOptionClick(option.text)}
                            type="button"
                            disabled={isSubmittingComplaint}
                            aria-label={`Select ${option.text}`}
                          >
                            {option.text}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {currentStep !== 'completed' && (
            <form onSubmit={handleSubmit} className="input-container">
              <button 
                type="button" 
                className="emoji-button"
                aria-label="Open emoji picker"
              >
                <BsEmojiSmile size={20} />
              </button>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="chat-input"
                placeholder="Type your message..."
                disabled={isWaitingForGPTResponse || isSubmittingComplaint}
                aria-label="Type your message"
              />
              <button 
                type="submit" 
                className="send-button"
                disabled={!inputValue.trim() || isWaitingForGPTResponse || isSubmittingComplaint}
                aria-label="Send message"
              >
                {isWaitingForGPTResponse || isSubmittingComplaint ? (
                  <div className="typing-indicator">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                ) : (
                  <IoMdSend size={20} />
                )}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatBot;
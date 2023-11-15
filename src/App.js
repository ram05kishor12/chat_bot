import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import './App.css';
import logo from './assets/chatgpt.svg';
import add from './assets/plus.png';
import box from './assets/message.svg';
import home from './assets/home.svg';
import saved from './assets/bookmark.svg';
import pro from './assets/rocket.svg';
import send from './assets/send.svg';
import userIcon from './assets/user-icon.png';
import gptImgLogo from './assets/gptlogo.png';
import OpenAI from 'openai';


const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

function App() {
  const[isTyping,setIsTyping] = useState(false);
  const msgEnd = useRef(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      text: "Hi, I am ChatGPT. How can I help you?",
      isBot: true,
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    const text = input;
    console.log("working...");

    // Update UI with user's message instantly
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        text,
        isBot: false,
      },
    ]);

    setLoading(true);
    setIsTyping(true);

    try {
      // Sending a request to OpenAI's chat completion API
      const res = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: input,
          },
        ],
        temperature: 0.9,
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));
  
      // Update UI with ChatGPT's response


      setMessages((prevMessages) => [
        ...prevMessages,
        {
          
            text: res.choices[0].message.content,
              isBot: true,      
    
        },
      ]);

      setInput('');
    } catch (error) {
      console.error('Error communicating with OpenAI:', error);
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  const handleQuery = async (queryText) => {
    // Update UI with user's query instantly

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        text: queryText,
        isBot: false,
      },
    ]);

    setLoading(true);
    setIsTyping(true);

    try {
      // Sending a request to OpenAI's chat completion API
      const res = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: queryText,
          },
        ],
        temperature: 0.9,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const botResponse = res.choices[0].message.content;
      const formattedBotResponse = splitIntoLines(botResponse);

      // Update UI with ChatGPT's response

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: formattedBotResponse,
          isBot: true,
        },
      ]);
    } catch (error) {
      console.error('Error communicating with OpenAI:', error);
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  useEffect(() => {
    msgEnd.current.scrollIntoView({ behavior: 'smooth' , block : 'end' });
  },[messages]);

  // Auto-scroll to the bottom of the chat when messages change
  useEffect(() => {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  const splitIntoLines = (text) => {
    return text.split('\n'); // Splitting text based on newline character
  };
  
  const handleEnter = async (e) => {
         if (e.key === 'Enter') await handleSend();
     }

  return (
    <div className="App">
      <div className="sideBar">
        <div className="upperSidebar">
          <div className='upperSideTop'>
            <img src={ logo } alt="" className="logo" />
            <span className="brand">Chat GPT</span>
          </div>
          <button className="midBtn" onClick={() => {window.location.reload()}}>
            <img src={add} alt="adb" className="addBtn" />New Chat
          </button>
          <div className="upperSideBottom">
          <button className="query" onClick={() => handleQuery("What's new?")}>
              <img src= {box} alt=""  />Whats new ?
            </button>
            <button className="query" onClick={() => handleQuery("Tell me about ChatGpt Voice Ai")}>
              <img src= {box} alt=''/> New ChatGpt Voice Ai
            </button>
          </div>
          </div>
        <div className="lowerSidebar">
          <p className='t'>This is powered by </p>
           <h3 className = 'text'> Openai <span> @chatgpt</span></h3>
        </div>
      </div>
      <div className="main" id="chat-container">
        <div className="chats">
          {messages.map((msg, i) => (
            <div key={i} 
            className={msg.isBot ? `chat bot${msg.entered ? ' entered' : ''}` : `chat${msg.entered ? ' entered' : ''}`}>
              <img src={msg.isBot ? gptImgLogo : userIcon} alt="" />
              <p className="txt">{msg.text}</p>
            </div>
          ))}
          {isTyping && (
            <div className="chat bot typing">
              <img src={gptImgLogo} alt="" />
              <p className="txt">Typing...</p>
            </div>
          )}
          <div ref={msgEnd} />
        </div>
        <div className="chatFooter">
          <div className="inp">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onKeyDown={handleEnter}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="send" onClick={handleSend} disabled={loading}>
              {loading ? 'Sending...' : <img src={send} alt="" />}
            </button>
          </div>
        </div>
        <div className="made">Made by <span>@ramkishore</span></div>
      </div>
    </div>
  );
}

export default App;

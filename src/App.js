import React, { useState } from 'react';
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
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      text: "Hi, I am ChatGPT. How can I help you?",
      isBot: true,
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    console.log("working...");

    setLoading(true);

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

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: input,
          isBot: false,
        },
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
    }
  };

  return (
    <div className="App">
      <div className="sideBar">
        <div className="upperSidebar">
          <div className='upperSideTop'>
            <img src={ logo } alt="" className="logo" />
            <span className="brand">Chat GPT</span>
          </div>
          <button className="midBtn">
            <img src={add} alt="adb" className="addBtn" />New Chat
          </button>
          <div className="upperSideBottom">
            <button className="query">
              <img src= {box} alt=""  />Whats is new ?
            </button>
            <button className='query'>
              <img src= {box} alt=''/> New ChatGpt Voice Ai
            </button>
          </div>
        </div>
        <div className="lowerSidebar">
          <div className="listitems">
            <img src= {home} alt='' className='listItemsimg'></img>Home
          </div>
          <div className="listitems">
            <img src= {saved} alt='' className='listItemsimg'></img>Saved
          </div>
          <div className="listitems">
            <img src= {pro} alt='' className='listItemsimg'></img>Upgrade to Pro
          </div>
        </div>
      </div>
      <div className="main">
        <div className="chats">
          {messages.map((messages ,i) => 
            <div key={i} className={messages.isBot?"chat bot":"chat"}>
              <img src = {messages.isBot?gptImgLogo:userIcon} alt=''/><p className='txt'>{ messages.text}</p>
            </div>
          )}
        </div>
        <div className='chatFooter'>
          <div className='inp'>
            <input type="text" placeholder='Type a message...' value={input} onChange={(e) => setInput(e.target.value)} />
            <button className='send' onClick={handleSend} disabled={loading}>
              {loading ? 'Sending...' : <img src={send} alt='' />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

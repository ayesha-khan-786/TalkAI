import './App.css';
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from './MyContext.jsx';
import { useState } from 'react';
import { v1 as uuidv1 } from 'uuid';

function App() {

  // Prompt = msg from the user
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);   // stores all chats of curr threads
  const [newChat, setNewChat] = useState(true);     // true bcoz always start with new chat
  const [allThreads, setAllThreads] = useState([]);   // store prev chats
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Passing values
  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads
  };    

  return (
    <div className='app'>
      <MyContext.Provider value = {providerValues}>
        <Sidebar></Sidebar>
        <ChatWindow></ChatWindow>
      </MyContext.Provider>
    </div>
  )
}

export default App

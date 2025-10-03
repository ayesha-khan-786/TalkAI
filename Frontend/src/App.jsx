import './App.css';
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from './MyContext.jsx';

function App() {

  const providerValues = {};    // Passing values

  return (
    <div className='main'>
      <MyContext.Provider values = {providerValues}>
        <Sidebar></Sidebar>
        <ChatWindow></ChatWindow>
      </MyContext.Provider>
    </div>
  )
}

export default App

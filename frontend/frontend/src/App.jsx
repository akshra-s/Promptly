import './App.css';
import Sidebar from './Sidebar.jsx';
import Navbar from "./Navbar.jsx";
import Chats from "./Chats.jsx";
import Inputbox from "./Inputbox.jsx";
import ChatWindow from './ChatWindow.jsx';
import { MyContext } from './MyContext.jsx';

function App() {
  const providerValues={};
  return (
    <div className='main'>
      <MyContext.Provider value={providerValues}>
        <Sidebar></Sidebar>
        <Navbar></Navbar>

        <ChatWindow>
          <Chats></Chats>
          <Inputbox></Inputbox>
        </ChatWindow>
      </MyContext.Provider>

    </div>
  )
}

export default App

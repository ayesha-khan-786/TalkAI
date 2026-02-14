import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { PropagateLoader } from "react-spinners";
import Login from "./Login.jsx";
import API from "./api/axios";
import Register from "./Register.jsx";

function ChatWindow() {
  const { prompt, setPrompt,
        reply, setReply,
        currThreadId, prevChats,
        setPrevChats, setNewChat,} = 
        useContext(MyContext);
  
        const [loading, setLoading] = useState(false);
        const [isOpen, setIsOpen] = useState(false); // User-dropdown
        const [showLoginModal, setShowLoginModal] = useState(false);
        const [authMode, setAuthMode] = useState("login");
        const token = localStorage.getItem("token");

  const getReply = async () => {
    const token = localStorage.getItem("token");

  // If user is NOT logged in
        if (!token) {
            setAuthMode("login");       // make sure login form shows
            setShowLoginModal(true);    // open modal
        return;                     
    }

  setLoading(true);
  setNewChat(false);

    console.log("message", prompt, " threadId ", currThreadId);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId,
      }),
    };

    try {
      const response = await fetch("https://talkai-backend-nxok.onrender.com/api/chat", options);
      const res = await response.json();
      console.log(res);
      setReply(res.reply);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  // Append new chat to previous chats
  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prevChats) => [
        ...prevChats,
        {
          role: "user",
          content: prompt,
        },
        {
          role: "assistant",
          content: reply,
        },
      ]);
    }

    setPrompt("");
  }, [reply]);

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOpenLogin = () => {
    setShowLoginModal(true);
  };

  const handleCloseLogin = () => {
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");

    // clear all chat data
    setPrevChats([]);
    setReply(null);
    setPrompt("");
    setNewChat(true);

    //reload page
    window.location.reload();
  };

  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>
          TalkAi <i className="fa-solid fa-chevron-down"></i>
        </span>
        <div className="userIconDiv" onClick={handleProfileClick}>
          <span className="userIcon">
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>

      {/* User Drop-down */}
      {isOpen && (
        <div className="dropDown">
          <div className="dropDownItem">
            <i className="fa-solid fa-cloud-arrow-up"></i> Upgrade Plan
          </div>
          <div className="dropDownItem">
            <i className="fa-solid fa-gear"></i> Settings
          </div>
          {/* Show Login & Register only if NOT logged in */}
          {!token && (
            <>
              <div
                className="dropDownItem"
                onClick={() => {
                  setAuthMode("login");
                  handleOpenLogin();
                }}
              >
                <i className="fa-solid fa-user-lock"></i> Log In
              </div>

              <div
                className="dropDownItem"
                onClick={() => {
                  setAuthMode("register");
                  handleOpenLogin();
                }}
              >
                <i className="fa-solid fa-user-plus"></i> Register
              </div>
            </>
          )}

          {/* Show Logout only if logged in */}
          {token && (
            <div className="dropDownItem" onClick={handleLogout}>
              <i className="fa-solid fa-arrow-right-from-bracket"></i> Log Out
            </div>
          )}
        </div>
      )}

      {showLoginModal && (
        <div className="modal-overlay" onClick={handleCloseLogin}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={handleCloseLogin}>
              ✕
            </button>
            {authMode === "login" ? (
              <Login
                onClose={handleCloseLogin}
                switchToRegister={() => setAuthMode("register")}
              />
            ) : (
              <Register
                onClose={handleCloseLogin}
                switchToLogin={() => setAuthMode("login")}
              />
            )}
          </div>
        </div>
      )}

      <Chat></Chat>

      <PropagateLoader color="#359e9dff" loading={loading}></PropagateLoader>

      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask anything"
            className="input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? getReply() : "")}
          ></input>
          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>

        <p className="info">
          TalkAi can make mistakes. Check important info. See Cookie
          Preferences.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;

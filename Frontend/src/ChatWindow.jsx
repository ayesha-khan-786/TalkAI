import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import {PropagateLoader} from "react-spinners";
import Login from "./Login.jsx";
import API from "./api/axios";

function ChatWindow() {

    const {prompt, setPrompt, reply, setReply, currThreadId, prevChats, setPrevChats, setNewChat} = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);        // User-dropdown
    const [showLoginModal, setShowLoginModal] = useState(false);

    const getReply = async () => {
        setLoading(true);
        setNewChat(false);

        const token = localStorage.getItem("token");

        console.log("message", prompt, " threadId ", currThreadId);
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        };

        try {
            const response = await fetch("http://localhost:8080/api/chat", options);
            const res = await response.json();
            console.log(res);
            setReply(res.reply);
        } catch(err) {
            console.log(err);
        }
        setLoading(false);
    }

    // Append new chat to previous chats
    useEffect(() => {
        if(prompt && reply) {
            setPrevChats(prevChats => (
                [...prevChats, {
                    role: "user",
                    content: prompt
                }, {
                    role: "assistant",
                    content: reply
                }]
            ))
        }

        setPrompt("");
    }, [reply]);

    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    }

    const handleOpenLogin = () => {
        setShowLoginModal(true);
    }
   
    const handleCloseLogin = () => {
        setShowLoginModal(false);
    }

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
                    <span>TalkAi <i className="fa-solid fa-chevron-down"></i></span>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>

            {/* User Drop-down */}
            {
                isOpen &&
                <div className="dropDown">
                    <div className="dropDownItem"><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade Plan</div>
                    <div className="dropDownItem"><i className="fa-solid fa-gear"></i> Settings</div>
                    <div className="dropDownItem"
                        onClick={handleOpenLogin}
                    ><i className="fa-solid fa-arrow-right-from-bracket"></i> Log In</div>
                    <div className="dropDownItem"
                        onClick={handleLogout}
                    ><i className="fa-solid fa-arrow-right-from-bracket"></i> Log Out</div>
                </div>
            }

            {
                showLoginModal && (
                    <div className="modal-overlay" onClick={handleCloseLogin}>
                        <div className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                        >
                        <button className="close-btn"
                            onClick={handleCloseLogin}
                        >
                             ✕
                        </button>
                        <Login onClose={handleCloseLogin} />
                    </div>
                </div>
            )
        }

            <Chat></Chat>

            <PropagateLoader color="#359e9dff" loading={loading}>
            </PropagateLoader>
           
            <div className="chatInput">
                <div className="inputBox">
                    <input placeholder="Ask anything" className="input"
                         value={prompt}
                         onChange={(e) => setPrompt(e.target.value)}
                         onKeyDown={(e) => e.key === "Enter" ? getReply() : ''}
                    >
                       
                    </input>
                    <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                </div>

                <p className="info">
                    TalkAi can make mistakes. Check important info. See Cookie Preferences.
                </p>
            </div>
        </div>
     );
}

export default ChatWindow;
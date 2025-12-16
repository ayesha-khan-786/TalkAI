import "./Chat.css";
import { useContext } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHightlight from "rehype-highlight";

// react-markdown => display info in proper format
// rehype-highlight => used for code syntax hightlight

function Chat() {

    const {newChat, prevChats} = useContext(MyContext); 
    return ( 
        <>
            {newChat && <h1>Ask Anything, Learn Everything!</h1>}
            <div className="chats">
                {
                    prevChats?.map((chat, idx) => 
                        <div className={chat.role === "user" ? "userDiv" : "aiDiv"} key={idx}>
                            {
                                chat.role === "user"? 
                                <p className="userMessage">{chat.content}</p> : 
                                <p className="aiMessage">{chat.content}</p> 
                            }
                        </div>
                    )
                }

{/* 
                <div className="userDiv">
                    <p className="userMessage">
                        User Message
                    </p>
                </div>
                
                <div className="aiDiv">
                    <p className="aiMessage">
                        Ai generated Message
                    </p>
                </div>              */}
            </div>
        </>
     )
}

export default Chat;
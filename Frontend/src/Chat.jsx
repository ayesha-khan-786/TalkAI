import "./Chat.css";
import { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHightlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

// react-markdown => display info in proper format
// rehype-highlight => used for code syntax hightlight

function Chat() {

    const {newChat, prevChats, reply} = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null); 
    
    useEffect(() => {
        if(reply === null) {
            setLatestReply(null);       // i.e loading previous chats
            return;
        }

        // latestReply separate => create typing effect
        if(!prevChats?.length) return;

        const content = reply.split(" ");       // store individual words

        let idx = 0;
        const interval = setInterval(() => {
            setLatestReply(content.slice(0, idx+1).join(" "));      // print separate separate word

            idx++;
            if(idx >= content.length) clearInterval(interval);
        }, 40);

        return () => clearInterval(interval);

    }, [prevChats, reply]);

    return ( 
        <>
            {newChat && <h1>Ask Anything, Learn Everything!</h1>}
            <div className="chats">
                {
                    prevChats?.slice(0, -1).map((chat, idx) => 
                        <div className={chat.role === "user" ? "userDiv" : "aiDiv"} key={idx}>
                            {
                                chat.role === "user"? 
                                <p className="userMessage">{chat.content}</p> : 
                                //<p className="aiMessage">{chat.content}</p> 
                                <div className="aiMessage">
                                <ReactMarkdown rehypePlugins={[rehypeHightlight]}>{chat.content}</ReactMarkdown>
                                </div>
                            }
                        </div>
                    )
                }

                {
                    prevChats.length > 0 && (
                        <>
                            {
                                latestReply === null ? (
                                     <div className="aiMessage" key={"non-typing"}>     {/* To print previous all chats */}
                                        <ReactMarkdown rehypePlugins={[rehypeHightlight]}>{prevChats[prevChats.length-1].content}</ReactMarkdown>
                                    </div>
                                ) : (
                                    <div className="aiMessage" key={"typing"}>          {/* To Print latest Reply */}
                                        <ReactMarkdown rehypePlugins={[rehypeHightlight]}>{latestReply}</ReactMarkdown>
                                    </div>
                                )
                            }
                        </>
                    )
                }

            </div>
        </>
     )
}

export default Chat;
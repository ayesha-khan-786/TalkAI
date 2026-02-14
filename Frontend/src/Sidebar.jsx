import "./Sidebar.css";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";
import logo from "./assets/logo4.png";

function Sidebar({ isOpen, setIsOpen }) {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
  } = useContext(MyContext);

  const getAllThreads = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("https://talkai-backend-nxok.onrender.com/api/thread", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await response.json();
      const filteredData = res.map((thread) => ({
        // Store thread id & title
        threadId: thread.threadId,
        title: thread.title,
      }));
      //console.log(filteredData);
      setAllThreads(filteredData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt(" ");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const changeThread = async (newThreadId) => {
    // Fetch data from DB
    setCurrThreadId(newThreadId);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://talkai-backend-nxok.onrender.com/api/thread/${newThreadId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const res = await response.json();
      console.log(res);
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://talkai-backend-nxok.onrender.com/api/thread/${threadId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const res = await response.json();
      console.log(res);

      // re-render updated threads
      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId !== threadId),
      );

      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className={`sidebar ${isOpen ? "active" : ""}`}>
      <button className="close-btn" onClick={() => setIsOpen(false)}>
        ✖
      </button>

      {/* new chat button */}
      <button onClick={createNewChat}>
        <img
          src="src/assets/logo4.png"
          alt="talkAi logo"
          className="logo"
        ></img>
        <span>
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>

      {/* History */}
      <ul className="history">
        {allThreads?.map((thread, idx) => (
          <li
            key={idx}
            onClick={(e) => changeThread(thread.threadId)} // Display chat in Thread
            className={thread.threadId === currThreadId ? "highlighted" : " "}
          >
            {thread.title}
            <i
              className="fa-solid fa-trash"
              onClick={(e) => {
                e.stopPropagation(); // stop event bubbling
                deleteThread(thread.threadId);
              }}
            ></i>
          </li>
        ))}
      </ul>

      {/* Sign */}
      <div className="sign">
        <p>
          Crafted with <span style={{ color: "red" }}>&hearts;</span> by Ayesha
          Khan
        </p>
      </div>
    </section>
  );
}

export default Sidebar;

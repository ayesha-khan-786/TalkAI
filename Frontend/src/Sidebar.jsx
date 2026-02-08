import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";

function Sidebar() {
     const {allThreads, setAllThreads, currThreadId} = useContext(MyContext);

     const getAllThreads = async () => {

          try {
               const response = await fetch("http://localhost:8080/api/thread");
               const res = await response.json();
               const filteredData = res.map(thread => ({         // Store thread id & title
                    threadId: thread.threadId,
                    title: thread.title}))
               console.log(filteredData);
               setAllThreads(filteredData);
          } catch(err) {
               console.log(err);
          }
          
     };

     useEffect(() => {
          getAllThreads();
     }, [currThreadId])


    return ( 
        <section className="sidebar">
           {/* new chat button */}
           <button>
                <img src="src/assets/logo4.png" alt="talkAi logo" className="logo"></img>
                <span><i className="fa-solid fa-pen-to-square"></i></span>
           </button>
          
           {/* History */}
           <ul className="history">
               {
                    allThreads?.map((thread, idx) => (
                         <li key={idx}>{thread.title}</li>
                    ))
               }
           </ul>
           
           {/* Sign */}
           <div className="sign">
                <p>Crafted with <span style={{color: "red"}}>&hearts;</span> by Ayesha Khan</p>
           </div>
        </section>
     );
}

export default Sidebar;
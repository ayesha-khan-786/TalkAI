import "./Sidebar.css";

function Sidebar() {
    return ( 
        <section className="sidebar">
           {/* new chat button */}
           <button>
                <img src="src/assets/abstract.png" alt="talkAi logo"></img>
                <i className="fa-solid fa-pen-to-square"></i>
           </button>
          
           {/* History */}
           <ul className="history">
                <li>History1</li>
                <li>History2</li>
                <li>History3</li>
                <li>History4</li>
           </ul>
           
           {/* Sign */}
           <div className="sign">
                <p>By Aisha Khan &hearts;</p>
           </div>
        </section>
     );
}

export default Sidebar;
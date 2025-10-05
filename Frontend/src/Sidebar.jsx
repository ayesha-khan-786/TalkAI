import "./Sidebar.css";

function Sidebar() {
    return ( 
        <section className="sidebar">
           {/* new chat button */}
           <button>
                <img src="src/assets/logo4.png" alt="talkAi logo" className="logo"></img>
                <span><i className="fa-solid fa-pen-to-square"></i></span>
           </button>
          
           {/* History */}
           <ul className="history">
                <li>Logo design help</li>
                <li>Write Linkedin post</li>
                <li>Bangladesh problems points image</li>
                <li>PPt on bangladesh issues</li>
           </ul>
           
           {/* Sign */}
           <div className="sign">
                <p>Crafted with <span style={{color: "red"}}>&hearts;</span> by Ayesha Khan</p>
           </div>
        </section>
     );
}

export default Sidebar;
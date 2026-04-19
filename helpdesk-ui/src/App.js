
import { useState, useEffect } from "react";

function App() {

const [tickets, setTickets] = useState([]);

const [title, setTitle] = useState("");

const [desc, setDesc] = useState("");

const [search, setSearch] = useState("");

const [filter, setFilter] = useState("All");

const [user, setUser] = useState(null);

const [username, setUsername] = useState("");

// 👉 BACKEND URL (IMPORTANT)

const API = "https://helpdesk-backend-doga.onrender.com";

// LOGIN

const login = () => {

if(username){

setUser(username);

}

};

// LOGOUT

const logout = () => {

setUser(null);

};

// GET

const getTickets = () => {

fetch(`${API}/tickets`)

.then(res => res.json())

.then(data => setTickets(data));

};

// CREATE

const createTicket = () => {

fetch(`${API}/tickets`, {

method:"POST",

headers:{"Content-Type":"application/json"},

body: JSON.stringify({ title, description: desc })

})

.then(()=> {

getTickets();

setTitle("");

setDesc("");

});

};

// DELETE

const deleteTicket = (id) => {

fetch(`${API}/tickets/${id}`,{

method:"DELETE"

})

.then(()=> getTickets());

};

// UPDATE (ADMIN ONLY)

const updateStatus = (id) => {

fetch(`${API}/tickets/${id}`,{

method:"PUT",

headers:{"Content-Type":"application/json"},

body: JSON.stringify({ status:"Completed" })

})

.then(()=> getTickets());

};

// COMMENT

const addComment = (id) => {

const comment = prompt("Enter comment");

fetch(`${API}/tickets/${id}/comment`,{

method:"POST",

headers:{"Content-Type":"application/json"},

body: JSON.stringify({ comment })

})

.then(()=> getTickets());

};

useEffect(() => {

getTickets();

// Dummy API

fetch("https://jsonplaceholder.typicode.com/users")

.then(res=>res.json())

.then(data=>console.log("Users:", data));

}, []);

return (

!user ? (
<div style={{textAlign:"center", marginTop:"50px"}}>
<h2>Login</h2>
<input

placeholder="Enter name (try admin)"

value={username}

onChange={(e)=>setUsername(e.target.value)}

style={{padding:"10px"}}

/>
<br/><br/>
<button onClick={login}>Login</button>
</div>

) : (
<div style={{

padding:"20px",

background:"#f5f6fa",

minHeight:"100vh",

fontFamily:"Arial"

}}>
<h1 style={{textAlign:"center"}}>

Helpdesk System 🚀
</h1>
<button onClick={logout}>Logout</button>

{/* SEARCH + FILTER */}
<div style={{margin:"20px 0"}}>
<input

placeholder="Search..."

value={search}

onChange={(e)=>setSearch(e.target.value)}

/>
<button onClick={()=>setFilter("All")}>All</button>
<button onClick={()=>setFilter("Open")}>Open</button>
<button onClick={()=>setFilter("Completed")}>Completed</button>
</div>

{/* CREATE */}
<div style={{

background:"white",

padding:"15px",

borderRadius:"10px"

}}>
<h3>Create Ticket</h3>
<input

value={title}

onChange={(e)=>setTitle(e.target.value)}

placeholder="Title"

/>
<input

value={desc}

onChange={(e)=>setDesc(e.target.value)}

placeholder="Description"

/>
<button onClick={createTicket}>Create</button>
</div>

{/* LIST */}

{tickets.length === 0 && <p>No tickets found</p>}

{tickets

.filter(t => filter === "All" || t.status === filter)

.filter(t => t.title.toLowerCase().includes(search.toLowerCase()))

.map((t,i)=>(
<div key={i} style={{

background:"white",

padding:"15px",

margin:"10px 0",

borderRadius:"10px"

}}>
<b>{t.title}</b> - {t.status}
<br/>
<small>{t.description}</small>
<br/>

Comments: {(t.comments || []).join(", ")}
<br/><br/>

{/* ADMIN ONLY */}

{user === "admin" && (
<button onClick={()=>updateStatus(i)}>Update</button>

)}
<button onClick={()=>deleteTicket(i)}>Delete</button>
<button onClick={()=>addComment(i)}>Comment</button>
</div>

))}
</div>

)

);

}

export default App;
 

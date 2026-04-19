import { useState, useEffect } from "react";
function App() {
const [tickets, setTickets] = useState([]);
const [title, setTitle] = useState("");
const [desc, setDesc] = useState("");
const [search, setSearch] = useState("");
const [filter, setFilter] = useState("All");
const [user, setUser] = useState(null);
const [username, setUsername] = useState("");
// 🔥 BACKEND URL
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
// UPDATE
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
minHeight:"100vh"
}}>
<h1>Helpdesk System 🚀</h1>
<button onClick={logout}>Logout</button>
{/* SEARCH */}
<input
placeholder="Search..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>
{/* FILTER */}
<button onClick={()=>setFilter("All")}>All</button>
<button onClick={()=>setFilter("Open")}>Open</button>
<button onClick={()=>setFilter("Completed")}>Completed</button>
{/* CREATE */}
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
{/* LIST */}
{tickets
.filter(t => filter === "All" || t.status === filter)
.filter(t => t.title?.toLowerCase().includes(search.toLowerCase()))
.map((t)=>(
<div key={t.id} style={{
background:"white",
padding:"10px",
margin:"10px 0"
}}>
<b>{t.title}</b> - {t.status}
<br/>
{t.description}
<br/>
Comments: {(t.comments || []).join(", ")}
<br/>
{user === "admin" && (
<button onClick={()=>updateStatus(t.id)}>Update</button>
)}
<button onClick={()=>deleteTicket(t.id)}>Delete</button>
<button onClick={()=>addComment(t.id)}>Comment</button>
</div>
))}
</div>
)
);
}
export default App;
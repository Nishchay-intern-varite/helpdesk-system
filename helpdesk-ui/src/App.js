import { useEffect, useState } from "react";
const API = "http://localhost:5000";
function App() {
 const [tickets, setTickets] = useState([]);
 const [title, setTitle] = useState("");
 const [desc, setDesc] = useState("");
 const fetchTickets = async () => {
   const res = await fetch(`${API}/tickets`);
   const data = await res.json();
   setTickets(Array.isArray(data) ? data : []);
 };
 useEffect(() => {
   fetchTickets();
 }, []);
 const createTicket = async () => {
   if (!title || !desc) {
     alert("Fill all fields");
     return;
   }
   await fetch(`${API}/tickets`, {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify({
       title,
       description: desc,
       email: "user@gmail.com",
     }),
   });
   setTitle("");
   setDesc("");
   fetchTickets();
 };
 const deleteTicket = async (id) => {
   await fetch(`${API}/tickets/${id}`, {
     method: "DELETE",
   });
   fetchTickets();
 };
 return (
<div style={{ padding: 20, fontFamily: "Arial" }}>
<h1>User Dashboard 👤</h1>
<div style={{ marginBottom: 20 }}>
<input
         placeholder="Title"
         value={title}
         onChange={(e) => setTitle(e.target.value)}
         style={{ marginRight: 10, padding: 8 }}
       />
<input
         placeholder="Description"
         value={desc}
         onChange={(e) => setDesc(e.target.value)}
         style={{ marginRight: 10, padding: 8 }}
       />
<button onClick={createTicket} style={{ padding: 8 }}>
         CREATE
</button>
</div>
     {tickets.length === 0 ? (
<p>No tickets found</p>
     ) : (
       tickets.map((t) => (
<div
           key={t.id}
           style={{
             border: "1px solid #ccc",
             padding: 12,
             marginBottom: 10,
             borderRadius: 8,
           }}
>
<h3>{t.title}</h3>
<p>{t.description}</p>
<p style={{ color: "red" }}>{t.status}</p>
<button onClick={() => deleteTicket(t.id)}>DELETE</button>
</div>
       ))
     )}
</div>
 );
}
export default App;
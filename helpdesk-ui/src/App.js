import { useState, useEffect } from "react";
import {
 Button,
 TextField,
 Card,
 CardContent,
 Typography
} from "@mui/material";
import { createClient } from "@supabase/supabase-js";
const API = "https://helpdesk-backend-doga.onrender.com";
const supabase = createClient(
 "https://jrdfzgulmeimpcjsslii.supabase.co",
 "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyZGZ6Z3VsbWVpbXBjanNzbGlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MDU3ODAsImV4cCI6MjA5MjE4MTc4MH0.YhzXGIu0-Rkdb5VBS9Wb8ORE4IbZaiMjKjDw8Wc0b6Q"
);
function App() {
 const [tickets, setTickets] = useState([]);
 const [page, setPage] = useState("tickets");
 const [title, setTitle] = useState("");
 const [desc, setDesc] = useState("");
 const [category, setCategory] = useState("General");
 const [priority, setPriority] = useState("Medium");
 const [search, setSearch] = useState("");
 const [filter, setFilter] = useState("All");
 const [user, setUser] = useState(null);
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 useEffect(() => {
   supabase.auth.getSession().then(({ data }) => {
     setUser(data.session?.user || null);
   });
   const { data: listener } = supabase.auth.onAuthStateChange(
     (_event, session) => setUser(session?.user || null)
   );
   return () => listener.subscription.unsubscribe();
 }, []);
 const getTickets = async () => {
   const res = await fetch(`${API}/tickets`);
   const data = await res.json();
   setTickets(data || []);
 };
 useEffect(() => {
   getTickets();
 }, []);
 const createTicket = async () => {
   if (!title || !desc) return alert("Fill all fields");
   await fetch(`${API}/tickets`, {
     method: "POST",
     headers: {
       "Content-Type": "application/json"
     },
     body: JSON.stringify({
       title,
       description: desc,
       email: user?.email,
       category,
       priority
     })
   });
   setTitle("");
   setDesc("");
   getTickets();
   setPage("tickets");
 };
 const updateStatus = async (id, status) => {
   await fetch(`${API}/tickets/${id}`, {
     method: "PUT",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ status })
   });
   getTickets();
 };
 const deleteTicket = async (id) => {
   await fetch(`${API}/tickets/${id}`, { method: "DELETE" });
   getTickets();
 };
 const addComment = async (id) => {
   const comment = prompt("Enter comment");
   if (!comment) return;
   await fetch(`${API}/tickets/${id}/comment`, {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ comment })
   });
   getTickets();
 };
 const login = async () => {
   const { error } = await supabase.auth.signInWithPassword({
     email,
     password
   });
   if (error) alert(error.message);
 };
 const signup = async () => {
   const { error } = await supabase.auth.signUp({
     email,
     password
   });
   if (!error) alert("Signup success");
 };
 const logout = async () => {
   await supabase.auth.signOut();
 };
 if (!user) {
   return (
<div style={{ textAlign: "center", marginTop: 100 }}>
<Typography variant="h4">HelpDesk Login</Typography>
<TextField label="Email" onChange={(e)=>setEmail(e.target.value)} />
<TextField type="password" label="Password" onChange={(e)=>setPassword(e.target.value)} />
<br /><br />
<Button onClick={login}>Login</Button>
<Button onClick={signup}>Signup</Button>
</div>
   );
 }
 const open = tickets.filter(t => t.status === "Open").length;
 const progress = tickets.filter(t => t.status === "In Progress").length;
 const closed = tickets.filter(t => t.status === "Closed").length;
 return (
<div style={{ padding: 20 }}>
     {/* NAVBAR */}
<div style={{
       display: "flex",
       justifyContent: "space-between",
       padding: 15,
       background: "#111",
       color: "white",
       borderRadius: 10
     }}>
<b>HelpDesk 🚀</b>
<div style={{ display: "flex", gap: 10 }}>
<Button variant="contained" onClick={()=>setPage("tickets")}>My Tickets</Button>
<Button variant="contained" onClick={()=>setPage("new")}>New Ticket</Button>
         {user.email === "admin@gmail.com" && (
<Button color="warning" variant="contained" onClick={()=>setPage("admin")}>
             Admin Panel
</Button>
         )}
<Button color="error" variant="contained" onClick={logout}>Logout</Button>
</div>
</div>
     {/* NEW TICKET */}
     {page === "new" && (
<Card style={{ marginTop: 20, padding: 20 }}>
<Typography variant="h5">Create Ticket</Typography>
<br />
<TextField fullWidth label="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
<br /><br />
<TextField fullWidth label="Description" value={desc} onChange={(e)=>setDesc(e.target.value)} />
<br /><br />
<TextField fullWidth label="Category" value={category} onChange={(e)=>setCategory(e.target.value)} />
<br /><br />
<TextField fullWidth label="Priority" value={priority} onChange={(e)=>setPriority(e.target.value)} />
<br /><br />
<Button variant="contained" onClick={createTicket}>Submit Ticket 🚀</Button>
</Card>
     )}
     {/* MY TICKETS */}
     {page === "tickets" && (
<>
<br />
<TextField label="Search" onChange={(e)=>setSearch(e.target.value)} />
<select onChange={(e)=>setFilter(e.target.value)}>
<option>All</option>
<option>Open</option>
<option>In Progress</option>
<option>Closed</option>
</select>
         {tickets
           .filter(t =>
             t.title.toLowerCase().includes(search.toLowerCase()) &&
             (filter === "All" || t.status === filter)
           )
           .map(t => (
<Card key={t.id} style={{ marginTop: 15, borderRadius: 12 }}>
<CardContent>
<Typography variant="h6">{t.title}</Typography>
<Typography>{t.description}</Typography>
<Typography>Status: {t.status}</Typography>
<Typography>Category: {t.category}</Typography>
<Typography>Priority: {t.priority}</Typography>
<Typography>
                   Comments: {Array.isArray(t.comments) ? t.comments.join(", ") : ""}
</Typography>
                 {user.email === "admin@gmail.com" && (
<>
<Button onClick={()=>updateStatus(t.id,"In Progress")}>Progress</Button>
<Button onClick={()=>updateStatus(t.id,"Closed")}>Close</Button>
</>
                 )}
<Button color="error" onClick={()=>deleteTicket(t.id)}>Delete</Button>
<Button onClick={()=>addComment(t.id)}>Comment</Button>
</CardContent>
</Card>
           ))}
</>
     )}
     {/* ADMIN PANEL */}
     {page === "admin" && (
<div style={{ marginTop: 20 }}>
<Typography variant="h5">Admin Dashboard 👑</Typography>
<br />
<Card style={{ padding: 15 }}>Open: {open}</Card>
<Card style={{ padding: 15 }}>In Progress: {progress}</Card>
<Card style={{ padding: 15 }}>Closed: {closed}</Card>
<Card style={{ padding: 15 }}>Total: {tickets.length}</Card>
</div>
     )}
</div>
 );
}
export default App;
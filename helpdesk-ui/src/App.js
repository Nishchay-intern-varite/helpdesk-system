import { useState, useEffect } from "react";
import { Button, TextField, Card, CardContent, Typography } from "@mui/material";
import { createClient } from "@supabase/supabase-js";
const API = "https://helpdesk-backend-doga.onrender.com";
const supabase = createClient(
 "https://jrdfzgulmeimpcjsslii.supabase.co",
 "PASTE_YOUR_ANON_KEY_HERE"
);
function App() {
 const [tickets, setTickets] = useState([]);
 const [title, setTitle] = useState("");
 const [desc, setDesc] = useState("");
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
     (_event, session) => {
       setUser(session?.user || null);
     }
   );
   return () => listener.subscription.unsubscribe();
 }, []);
 const getTickets = async () => {
   const res = await fetch(`${API}/tickets`);
   const data = await res.json();
   setTickets(Array.isArray(data) ? data : []);
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
       email: user?.email || "demo@gmail.com"
     })
   });
   setTitle("");
   setDesc("");
   getTickets();
 };
 const updateStatus = async (id) => {
   await fetch(`${API}/tickets/${id}`, { method: "PUT" });
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
<div style={{ textAlign: "center", marginTop: "100px" }}>
<Typography variant="h4">Login / Signup</Typography>
<TextField label="Email" onChange={(e) => setEmail(e.target.value)} />
<TextField type="password" label="Password" onChange={(e) => setPassword(e.target.value)} />
<br /><br />
<Button onClick={login}>Login</Button>
<Button onClick={signup}>Signup</Button>
</div>
   );
 }
 return (
<div style={{ padding: "20px" }}>
<Typography variant="h4">
       {user.email === "admin@gmail.com" ? "Admin Dashboard 👑" : "User Dashboard 👤"}
</Typography>
<Typography>{user.email}</Typography>
<Button onClick={logout}>Logout</Button>
<br /><br />
<TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
<TextField label="Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
<Button onClick={createTicket}>Create</Button>
<br /><br />
<TextField label="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
<select onChange={(e) => setFilter(e.target.value)}>
<option>All</option>
<option>Open</option>
<option>Completed</option>
</select>
     {tickets
       .filter((t) => {
         if (user.email !== "admin@gmail.com" && t.user_email !== user.email) return false;
         if (filter !== "All" && t.status !== filter) return false;
         return t.title.toLowerCase().includes(search.toLowerCase());
       })
       .map((t) => (
<Card key={t.id} style={{ margin: "10px" }}>
<CardContent>
<Typography>{t.title}</Typography>
<Typography>{t.description}</Typography>
<Typography style={{ color: t.status === "Open" ? "red" : "green" }}>
               {t.status}
</Typography>
<Typography>{t.user_email}</Typography>
<Typography>
               {Array.isArray(t.comments) ? t.comments.join(", ") : "No comments"}
</Typography>
             {user.email === "admin@gmail.com" && (
<Button onClick={() => updateStatus(t.id)}>Update</Button>
             )}
<Button onClick={() => deleteTicket(t.id)}>Delete</Button>
<Button onClick={() => addComment(t.id)}>Comment</Button>
</CardContent>
</Card>
       ))}
</div>
 );
}
export default App;
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
 "YOUR_ANON_KEY"
);
function App() {
 const [tickets, setTickets] = useState([]);
 const [title, setTitle] = useState("");
 const [desc, setDesc] = useState("");
 const [search, setSearch] = useState("");
 const [filter, setFilter] = useState("All");
 const [loading, setLoading] = useState(false);
 const [user, setUser] = useState(null);
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const getTickets = async () => {
   const res = await fetch(`${API}/tickets`);
   const data = await res.json();
   setTickets(Array.isArray(data) ? data : []);
 };
 const createTicket = async () => {
   if (!title || !desc) {
     alert("Fill all fields");
     return;
   }
   setLoading(true);
   await fetch(`${API}/tickets`, {
     method: "POST",
     headers: {
       "Content-Type": "application/json"
     },
     body: JSON.stringify({
       title,
       description: desc,
       email: user?.email
     })
   });
   setLoading(false);
   setTitle("");
   setDesc("");
   getTickets();
 };
 const updateStatus = async (id) => {
   await fetch(`${API}/tickets/${id}`, {
     method: "PUT"
   });
   getTickets();
 };
 const deleteTicket = async (id) => {
   await fetch(`${API}/tickets/${id}`, {
     method: "DELETE"
   });
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
   const { data, error } = await supabase.auth.signInWithPassword({
     email,
     password
   });
   if (error) alert("Login failed ❌");
   else setUser(data.user);
 };
 const signup = async () => {
   const { error } = await supabase.auth.signUp({
     email,
     password
   });
   if (!error) alert("Signup success ✅");
 };
 const logout = async () => {
   await supabase.auth.signOut();
   setUser(null);
 };
 useEffect(() => {
   getTickets();
 }, []);
 return !user ? (
<div style={{ textAlign: "center", marginTop: "100px" }}>
<Typography variant="h4">Login / Signup</Typography>
<TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
<TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
<br /><br />
<Button onClick={login}>Login</Button>
<Button onClick={signup}>Signup</Button>
</div>
 ) : (
<div style={{ padding: "20px" }}>
<Typography variant="h4">
       {user.email === "admin@gmail.com" ? "Admin Dashboard 👑" : "User Dashboard 👤"}
</Typography>
<Typography>{user.email}</Typography>
<Typography>Total Tickets: {tickets.length}</Typography>
<Button onClick={logout}>Logout</Button>
<br /><br />
     {/* CREATE */}
<TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
<TextField label="Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
<Button disabled={loading} onClick={createTicket}>
       {loading ? "Creating..." : "Create"}
</Button>
<br /><br />
     {/* SEARCH */}
<TextField label="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
     {/* FILTER */}
<select onChange={(e) => setFilter(e.target.value)}>
<option>All</option>
<option>Open</option>
<option>Completed</option>
</select>
     {tickets.length === 0 && <p>No tickets found</p>}
     {tickets
       .filter((t) => {
         if (user.email !== "admin@gmail.com" && t.user_email !== user.email) return false;
         if (filter !== "All" && t.status !== filter) return false;
         return t.title.toLowerCase().includes(search.toLowerCase());
       })
       .map((t) => (
<Card key={t.id} style={{ margin: "10px" }}>
<CardContent>
<Typography variant="h6">{t.title}</Typography>
<Typography>{t.description}</Typography>
<Typography style={{ color: t.status === "Open" ? "red" : "green" }}>
               {t.status}
</Typography>
<Typography>User: {t.user_email}</Typography>
<Typography>
               Created: {t.created_at ? new Date(t.created_at).toLocaleString() : ""}
</Typography>
<Typography>
               Comments: {Array.isArray(t.comments) ? t.comments.join(", ") : "No comments"}
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
import { useState, useEffect } from "react";
import { Button, TextField, Card, CardContent, Typography } from "@mui/material";
import { createClient } from "@supabase/supabase-js";
const API = "https://helpdesk-backend-doga.onrender.com";
const supabase = createClient(
 "https://jrdfzgulmeimpcjsslii.supabase.co",
 "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyZGZ6Z3VsbWVpbXBjanNzbGlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MDU3ODAsImV4cCI6MjA5MjE4MTc4MH0.YhzXGIu0-Rkdb5VBS9Wb8ORE4IbZaiMjKjDw8Wc0b6Q"
);
function App() {
 const [tickets, setTickets] = useState([]);
 const [title, setTitle] = useState("");
 const [desc, setDesc] = useState("");
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
<Typography variant="h4">Dashboard</Typography>
<Typography>{user.email}</Typography>
<Button onClick={logout}>Logout</Button>
<br /><br />
<TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
<TextField label="Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
<Button onClick={createTicket}>Create</Button>
     {tickets.map((t) => (
<Card key={t.id} style={{ margin: "10px" }}>
<CardContent>
<Typography>{t.title}</Typography>
<Typography>{t.description}</Typography>
</CardContent>
</Card>
     ))}
</div>
 );
}
export default App;
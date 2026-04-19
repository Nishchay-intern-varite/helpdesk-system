import { useState, useEffect } from "react";
import { Button, TextField, Card, CardContent, Typography } from "@mui/material";
import { createClient } from "@supabase/supabase-js";
const API = "https://helpdesk-backend-doga.onrender.com";
// 🔥 SUPABASE
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
 // ✅ GET TICKETS
 const getTickets = async () => {
   try {
     const res = await fetch(`${API}/tickets`);
     const data = await res.json();
     setTickets(Array.isArray(data) ? data : []);
   } catch {
     setTickets([]);
   }
 };
 // ✅ CREATE
 const createTicket = async () => {
   await fetch(`${API}/tickets`, {
     method: "POST",
     headers: {
       "Content-Type": "application/json"
     },
     body: JSON.stringify({ title, description: desc })
   });
   getTickets();
   setTitle("");
   setDesc("");
 };
 // 🔐 LOGIN
 const login = async () => {
   const { data, error } = await supabase.auth.signInWithPassword({
     email,
     password
   });
   if (error) {
     alert("Login failed ❌");
   } else {
     setUser(data.user);
   }
 };
 // 🔐 SIGNUP
 const signup = async () => {
   const { error } = await supabase.auth.signUp({
     email,
     password
   });
   if (!error) {
     alert("Signup success ✅");
   } else {
     alert("Signup failed ❌");
   }
 };
 // 🔐 LOGOUT
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
<TextField
       label="Email"
       value={email}
       onChange={(e) => setEmail(e.target.value)}
       style={{ marginTop: "20px", width: "250px" }}
     />
<br />
<TextField
       label="Password"
       type="password"
       value={password}
       onChange={(e) => setPassword(e.target.value)}
       style={{ marginTop: "10px", width: "250px" }}
     />
<br /><br />
<Button
       variant="contained"
       onClick={login}
       style={{ marginRight: "10px" }}
>
       Login
</Button>
<Button
       variant="outlined"
       onClick={signup}
>
       Signup
</Button>
</div>
 ) : (
<div style={{ padding: "20px", background: "#f4f6f8", minHeight: "100vh" }}>
<Typography variant="h4">Helpdesk System 🚀</Typography>
<Typography>Logged in as: {user.email}</Typography>
<Button onClick={logout}>Logout</Button>
<br /><br />
     {/* CREATE */}
<Card style={{ padding: "20px", marginBottom: "20px" }}>
<Typography variant="h6">Create Ticket</Typography>
<TextField
         label="Title"
         fullWidth
         value={title}
         onChange={(e) => setTitle(e.target.value)}
         style={{ marginTop: "10px" }}
       />
<TextField
         label="Description"
         fullWidth
         value={desc}
         onChange={(e) => setDesc(e.target.value)}
         style={{ marginTop: "10px" }}
       />
<Button
         variant="contained"
         style={{ marginTop: "15px" }}
         onClick={createTicket}
>
         Create
</Button>
</Card>
     {/* LIST */}
     {Array.isArray(tickets) && tickets.map((t) => (
<Card key={t.id} style={{ marginBottom: "15px" }}>
<CardContent>
<Typography variant="h6">
             {t.title} - {t.status}
</Typography>
<Typography>{t.description}</Typography>
<Typography variant="body2">
             Comments: {Array.isArray(t.comments) ? t.comments.join(", ") : ""}
</Typography>
</CardContent>
</Card>
     ))}
</div>
 );
}
export default App;
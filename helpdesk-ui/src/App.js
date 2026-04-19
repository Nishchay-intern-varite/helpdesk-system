import { useState, useEffect } from "react";
import { Button, TextField, Card, CardContent, Typography } from "@mui/material";
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
 const [user, setUser] = useState(null);
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const getTickets = async () => {
   const res = await fetch(`${API}/tickets`);
   const data = await res.json();
   setTickets(Array.isArray(data) ? data : []);
 };
 const createTicket = async () => {
   await fetch(`${API}/tickets`, {
     method: "POST",
     headers: {
       "Content-Type": "application/json"
     },
     body: JSON.stringify({
       title,
       description: desc,
       email: user.email
     })
   });
   getTickets();
   setTitle("");
   setDesc("");
 };
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
<TextField
       label="Email"
       value={email}
       onChange={(e) => setEmail(e.target.value)}
     />
<TextField
       label="Password"
       type="password"
       value={password}
       onChange={(e) => setPassword(e.target.value)}
       style={{ marginTop: "10px" }}
     />
<br /><br />
<Button onClick={login}>Login</Button>
<Button onClick={signup} style={{ marginLeft: "10px" }}>
       Signup
</Button>
</div>
 ) : (
<div style={{ padding: "20px" }}>
<Typography variant="h4">Helpdesk 🚀</Typography>
<Typography>Logged in as: {user.email}</Typography>
<Button onClick={logout}>Logout</Button>
<br /><br />
<TextField
       label="Title"
       value={title}
       onChange={(e) => setTitle(e.target.value)}
     />
<TextField
       label="Description"
       value={desc}
       onChange={(e) => setDesc(e.target.value)}
     />
<Button onClick={createTicket}>Create</Button>
     {tickets
       .filter((t) => {
         if (user.email === "admin@gmail.com") return true;
         return t.user_email === user.email;
       })
       .map((t) => (
<Card key={t.id} style={{ margin: "10px" }}>
<CardContent>
<Typography>{t.title} - {t.status}</Typography>
<Typography>{t.description}</Typography>
</CardContent>
</Card>
       ))}
</div>
 );
}
export default App;
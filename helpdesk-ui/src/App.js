import { useState, useEffect } from "react";
import { Button, TextField, Card, CardContent, Typography } from "@mui/material";
const API = "https://helpdesk-backend-doga.onrender.com";
function App() {
 const [tickets, setTickets] = useState([]);
 const [title, setTitle] = useState("");
 const [desc, setDesc] = useState("");
 const [user, setUser] = useState(null);
 const [username, setUsername] = useState("");
 const getTickets = async () => {
   try {
     const res = await fetch(`${API}/tickets`);
     const data = await res.json();
     setTickets(Array.isArray(data) ? data : []);
   } catch (err) {
     console.log(err);
     setTickets([]);
   }
 };
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
 const login = () => {
   if (username) setUser(username);
 };
 useEffect(() => {
   getTickets();
 }, []);
 return !user ? (
<div style={{ textAlign: "center", marginTop: "100px" }}>
<Typography variant="h4">Login</Typography>
<TextField
       label="Enter name"
       value={username}
       onChange={(e) => setUsername(e.target.value)}
     />
<br /><br />
<Button variant="contained" onClick={login}>
       Login
</Button>
</div>
 ) : (
<div style={{ padding: "20px" }}>
<Typography variant="h4">Helpdesk System 🚀</Typography>
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
     {Array.isArray(tickets) && tickets.map((t) => (
<Card key={t.id} style={{ margin: "10px" }}>
<CardContent>
<Typography>{t.title} - {t.status}</Typography>
<Typography>{t.description}</Typography>
<Typography>
             Comments: {Array.isArray(t.comments) ? t.comments.join(", ") : ""}
</Typography>
</CardContent>
</Card>
     ))}
</div>
 );
}
export default App;
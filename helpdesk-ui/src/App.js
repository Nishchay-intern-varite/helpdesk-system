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
   const res = await fetch(`${API}/tickets`);
   const data = await res.json();
   setTickets(data);
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
 const deleteTicket = async (id) => {
   await fetch(`${API}/tickets/${id}`, { method: "DELETE" });
   getTickets();
 };
 const updateStatus = async (id) => {
   await fetch(`${API}/tickets/${id}`, {
     method: "PUT",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ status: "Completed" })
   });
   getTickets();
 };
 const addComment = async (id) => {
   const comment = prompt("Enter comment");
   await fetch(`${API}/tickets/${id}/comment`, {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ comment })
   });
   getTickets();
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
       style={{ marginTop: "20px" }}
     />
<br /><br />
<Button variant="contained" onClick={() => setUser(username)}>
       Login
</Button>
</div>
 ) : (
<div style={{ padding: "20px", background: "#f4f6f8", minHeight: "100vh" }}>
<Typography variant="h4" gutterBottom>
       Helpdesk System 🚀
</Typography>
<Button variant="outlined" onClick={() => setUser(null)}>
       Logout
</Button>
<br /><br />
     {/* CREATE FORM */}
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
     {/* TICKETS */}
     {tickets.map((t) => (
<Card key={t.id} style={{ marginBottom: "15px" }}>
<CardContent>
<Typography variant="h6">
             {t.title} - {t.status}
</Typography>
<Typography>{t.description}</Typography>
<Typography variant="body2" color="gray">
             Comments: {(t.comments || []).join(", ")}
</Typography>
<br />
           {user === "admin" && (
<Button
               variant="contained"
               color="success"
               onClick={() => updateStatus(t.id)}
               style={{ marginRight: "10px" }}
>
               Update
</Button>
           )}
<Button
             variant="outlined"
             color="error"
             onClick={() => deleteTicket(t.id)}
             style={{ marginRight: "10px" }}
>
             Delete
</Button>
<Button
             variant="outlined"
             onClick={() => addComment(t.id)}
>
             Comment
</Button>
</CardContent>
</Card>
     ))}
</div>
 );
}
export default App;
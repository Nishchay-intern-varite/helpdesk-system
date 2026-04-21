import { useEffect, useState } from "react";
// 📊 CHART
import {
 Chart as ChartJS,
 ArcElement,
 Tooltip,
 Legend
} from "chart.js";
import { Pie } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);
const API = "https://your-backend.onrender.com";
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASS = "1234";
function App() {
 const [tickets, setTickets] = useState([]);
 const [title, setTitle] = useState("");
 const [desc, setDesc] = useState("");
 const [priority, setPriority] = useState("Medium");
 const [search, setSearch] = useState("");
 const [filter, setFilter] = useState("All");
 const [isLoggedIn, setIsLoggedIn] = useState(false);
 const [isAdmin, setIsAdmin] = useState(false);
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [comment, setComment] = useState("");
 const [dark, setDark] = useState(false);
 useEffect(() => {
   document.body.style.background = dark ? "#121212" : "#eef2f7";
   document.body.style.color = dark ? "white" : "black";
   if (isLoggedIn) fetchTickets();
 }, [isLoggedIn, dark]);
 // 🔹 FETCH
 const fetchTickets = async () => {
   try {
     const res = await fetch(`${API}/tickets`);
     const data = await res.json();
     setTickets(data || []);
   } catch (err) {
     console.log(err);
   }
 };
 // 🔹 CREATE
 const createTicket = async () => {
   if (!title || !desc) return alert("Fill all fields");
   await fetch(`${API}/tickets`, {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({
       title,
       description: desc,
       priority,
       user_email: email.toLowerCase()
     })
   });
   setTitle("");
   setDesc("");
   fetchTickets();
 };
 // 🔹 DELETE
 const deleteTicket = async (id) => {
   await fetch(`${API}/tickets/${id}`, { method: "DELETE" });
   fetchTickets();
 };
 // 🔹 STATUS
 const updateStatus = async (id) => {
   await fetch(`${API}/tickets/${id}`, {
     method: "PUT",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ status: "Closed" })
   });
   fetchTickets();
 };
 // 🔹 COMMENT
 const addComment = async (id) => {
   if (!comment) return;
   await fetch(`${API}/tickets/${id}/comment`, {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ comment })
   });
   setComment("");
   fetchTickets();
 };
 // 🔐 LOGIN
 const handleLogin = () => {
   if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
     setIsAdmin(true);
   }
   setIsLoggedIn(true);
 };
 const logout = () => {
   setIsLoggedIn(false);
   setIsAdmin(false);
 };
 // 📊 CHART
 const chartData = {
   labels: ["Open", "Closed"],
   datasets: [
     {
       data: [
         tickets.filter(t => t.status === "Open").length,
         tickets.filter(t => t.status === "Closed").length
       ],
       backgroundColor: ["#ff4d4f", "#52c41a"]
     }
   ]
 };
 const dynamic = {
   card: {
     background: dark ? "#1e1e1e" : "white",
     color: dark ? "white" : "black",
     padding: "20px",
     borderRadius: "10px",
     marginBottom: "20px"
   },
   ticket: {
     background: dark ? "#1e1e1e" : "white",
     color: dark ? "white" : "black",
     padding: "15px",
     margin: "10px 0",
     borderRadius: "10px"
   }
 };
 // 🔐 LOGIN SCREEN
 if (!isLoggedIn) {
   return (
<div style={styles.center}>
<div style={dynamic.card}>
<h2>Login</h2>
<input placeholder="Email" onChange={(e) => setEmail(e.target.value)} style={styles.input} />
<input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} style={styles.input} />
<button onClick={handleLogin} style={styles.btn}>Login</button>
</div>
</div>
   );
 }
 return (
<div style={{ padding: "20px" }}>
<h1>🎫 Helpdesk</h1>
<button onClick={() => setDark(!dark)} style={styles.btn}>
       {dark ? "☀️ Light" : "🌙 Dark"}
</button>
<button onClick={logout} style={styles.btn}>Logout</button>
     {/* 📊 DASHBOARD */}
<div style={styles.dashboard}>
<div style={styles.stat}>Total: {tickets.length}</div>
<div style={styles.stat}>Open: {tickets.filter(t => t.status === "Open").length}</div>
<div style={styles.stat}>Closed: {tickets.filter(t => t.status === "Closed").length}</div>
<div style={{ width: "200px" }}>
<Pie data={chartData} />
</div>
</div>
     {/* 🔍 SEARCH + FILTER */}
<input placeholder="Search..." onChange={(e) => setSearch(e.target.value)} style={styles.input} />
     {/* 👤 USER PANEL */}
     {!isAdmin && (
<div style={dynamic.card}>
<h3>Create Ticket</h3>
<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" style={styles.input} />
<input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description" style={styles.input} />
<select onChange={(e) => setPriority(e.target.value)} style={styles.input}>
<option>High</option>
<option>Medium</option>
<option>Low</option>
</select>
<button onClick={createTicket} style={styles.btn}>Create</button>
</div>
     )}
<h2>{isAdmin ? "Admin Panel" : "My Tickets"}</h2>
     {tickets
       .filter(t => isAdmin || t.user_email === email.toLowerCase())
       .filter(t => filter === "All" || t.status === filter)
       .filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
       .map(t => (
<div key={t.id} style={dynamic.ticket}>
<h3>{t.title}</h3>
<p>{t.description}</p>
           {/* 🕒 TIMESTAMP */}
<p style={{ fontSize: "12px", color: "gray" }}>
             {new Date(t.created_at).toLocaleString()}
</p>
<p>Status: {t.status}</p>
<p>Priority: {t.priority}</p>
           {/* 💬 COMMENTS DISPLAY */}
           {t.comments?.map((c, i) => (
<p key={i} style={{ fontSize: "12px" }}>💬 {c}</p>
           ))}
           {isAdmin && (
<>
<button onClick={() => updateStatus(t.id)}>Close</button>
<button onClick={() => deleteTicket(t.id)}>Delete</button>
<input
                 placeholder="Comment"
                 value={comment}
                 onChange={(e) => setComment(e.target.value)}
               />
<button onClick={() => addComment(t.id)}>Add</button>
</>
           )}
</div>
       ))}
</div>
 );
}
const styles = {
 center: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" },
 input: { display: "block", margin: "10px 0", padding: "10px", width: "100%" },
 btn: { padding: "10px", margin: "5px", background: "#007bff", color: "white", border: "none" },
 dashboard: { display: "flex", gap: "10px", alignItems: "center", margin: "20px 0" },
 stat: { background: "#007bff", color: "white", padding: "10px", borderRadius: "5px" }
};
export default App;
import { useState, useEffect } from "react";

import { Button, TextField, Card, CardContent, Typography } from "@mui/material";

import { createClient } from "@supabase/supabase-js";

const API = "https://helpdesk-backend-doga.onrender.com";

// 🔥 SUPABASE AUTH

const supabase = createClient(

  "https://jrdfzgulmeimpcjsslii.supabase.co",

  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyZGZ6Z3VsbWVpbXBjanNzbGlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MDU3ODAsImV4cCI6MjA5MjE4MTc4MH0.YhzXGIu0-Rkdb5VBS9Wb8ORE4IbZaiMjKjDw8Wc0b6Q"

);

function App() {

  const [tickets, setTickets] = useState([]);

  const [title, setTitle] = useState("");

  const [desc, setDesc] = useState("");

  const [user, setUser] = useState(null);

  const [username, setUsername] = useState("");

  // 🔥 GET

  const getTickets = async () => {

    const res = await fetch(`${API}/tickets`);

    const data = await res.json();

    setTickets(data);

  };

  // 🔥 CREATE

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

  // 🔥 DELETE

  const deleteTicket = async (id) => {

    await fetch(`${API}/tickets/${id}`, { method: "DELETE" });

    getTickets();

  };

  // 🔥 UPDATE

  const updateStatus = async (id) => {

    await fetch(`${API}/tickets/${id}`, {

      method: "PUT",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({ status: "Completed" })

    });

    getTickets();

  };

  // 🔥 COMMENT

  const addComment = async (id) => {

    const comment = prompt("Enter comment");

    await fetch(`${API}/tickets/${id}/comment`, {

      method: "POST",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({ comment })

    });

    getTickets();

  };

  // 🔥 LOGIN

  const login = async () => {

    const { error } = await supabase.auth.signInWithPassword({

      email: username,

      password: "123456"

    });

    if (error) {

      alert("Login failed ❌");

      console.log(error);

    } else {

      alert("Login success ✅");

      setUser(username);

    }

  };

  // 🔥 SIGNUP

  const signup = async () => {

    const { error } = await supabase.auth.signUp({

      email: username,

      password: "123456"

    });

    if (!error) {

      alert("Signup success ✅");

    } else {

      alert("Signup failed ❌");

      console.log(error);

    }

  };

  useEffect(() => {

    getTickets();

  }, []);

  return !user ? (
<div style={{ textAlign: "center", marginTop: "100px" }}>
<Typography variant="h4">Login</Typography>
<TextField

        label="Email"

        value={username}

        onChange={(e) => setUsername(e.target.value)}

        style={{ marginTop: "20px" }}

      />
<br /><br />
<Button variant="contained" onClick={login}>

        Login
</Button>
<br /><br />
<Button variant="outlined" onClick={signup}>

        Signup
</Button>
</div>

  ) : (
<div style={{ padding: "20px", background: "#f4f6f8", minHeight: "100vh" }}>
<Typography variant="h4">Helpdesk System 🚀</Typography>
<Button onClick={() => setUser(null)}>Logout</Button>
<br /><br />
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

      {tickets.map((t) => (
<Card key={t.id} style={{ marginBottom: "15px" }}>
<CardContent>
<Typography variant="h6">

              {t.title} - {t.status}
</Typography>
<Typography>{t.description}</Typography>
<Typography variant="body2">

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
 
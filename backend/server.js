const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
let tickets = [];
// GET
app.get("/tickets", (req, res) => {
 res.json(tickets);
});
// CREATE
app.post("/tickets", (req, res) => {
 const newTicket = {
   id: tickets.length,
   title: req.body.title,
   description: req.body.description,
   status: "Open",
   comments: []
 };
 tickets.push(newTicket);
 console.log("📧 Email sent to user (demo)");
 res.json(newTicket);
});
// UPDATE (ADMIN)
app.put("/tickets/:id", (req, res) => {
 tickets[req.params.id].status = req.body.status;
 res.json(tickets);
});
// DELETE
app.delete("/tickets/:id", (req, res) => {
 tickets.splice(req.params.id, 1);
 res.json(tickets);
});
// COMMENT
app.post("/tickets/:id/comment", (req, res) => {
 tickets[req.params.id].comments.push(req.body.comment);
 res.json(tickets);
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running"));
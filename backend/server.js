const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
let tickets = [];
// Test
app.get("/", (req, res) => {
 res.send("Server running");
});
// GET all tickets
app.get("/tickets", (req, res) => {
 res.json(tickets);
});
// POST create ticket
app.post("/tickets", (req, res) => {
 const newTicket = {
   id: tickets.length,
   title: req.body.title,
   description: req.body.description,
   status: "Open",
   comments: []
 };
 tickets.push(newTicket);
 res.json({
   message: "Ticket created",
   data: newTicket
 });
});
app.post("/tickets/:id/comment", (req, res) => {
 const id = parseInt(req.params.id);
 if (tickets[id] !== undefined) {
   if (!tickets[id].comments) {
     tickets[id].comments = [];
   }
   tickets[id].comments.push(req.body.comment);
   res.json({
     message: "Comment added",
     data: tickets[id]
   });
 } else {
   res.send("Ticket not found");
 }
});
// PUT update status
app.put("/tickets/:id", (req, res) => {
 const id = parseInt(req.params.id);
 if (tickets[id] !== undefined) {
   tickets[id].status = req.body.status;
   res.json({
     message: "Status updated",
     data: tickets[id]
   });
 } else {
   res.send("Ticket not found");
 }
});
// DELETE ticket
app.delete("/tickets/:id", (req, res) => {
 const id = parseInt(req.params.id);
 if (tickets[id] !== undefined) {
   tickets.splice(id, 1);
   res.json({
     message: "Ticket deleted"
   });
 } else {
   res.send("Ticket not found");
 }
});
// Start server
app.listen(5000, () => {
 console.log("Server started on port 5000");
});
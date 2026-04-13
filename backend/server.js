const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.json());
let tickets = [];
// Test route
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
   id: tickets.length,   // ✅ IMPORTANT (id add ki)
   title: req.body.title,
   description: req.body.description,
   status: "Open"
 };
 tickets.push(newTicket);
 res.json({
   message: "Ticket created",
   data: newTicket
 });
});
// PUT update status
app.put("/tickets/:id", (req, res) => {
 const id = parseInt(req.params.id);
 const ticket = tickets.find(t => t.id === id);
 if (ticket) {
   ticket.status = req.body.status;
   res.json({
     message: "Status updated",
     data: ticket
   });
 } else {
   res.send("Ticket not found");
 }
});
app.delete("/tickets/:id", (req, res) => {

const id = parseInt(req.params.id);

// ticket ka index find karo
const index = tickets.findIndex(t => t.id === id);

if (index !== -1) {

tickets.splice(index, 1); // delete

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
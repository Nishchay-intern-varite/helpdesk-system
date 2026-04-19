import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
const app = express();
app.use(cors());
app.use(express.json());
// 🔥 SUPABASE CONNECT
const supabase = createClient(
 "https://jrdfzgulmeimpcjsslii.supabase.co",
 "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyZGZ6Z3VsbWVpbXBjanNzbGlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MDU3ODAsImV4cCI6MjA5MjE4MTc4MH0.YhzXGIu0-Rkdb5VBS9Wb8ORE4IbZaiMjKjDw8Wc0b6Q"
);
// 👉 GET ALL TICKETS
app.get("/tickets", async (req, res) => {
 const { data, error } = await supabase.from("tickets").select("*");
 if (error) {
   console.log(error);
   return res.status(500).json({ message: "error fetching" });
 }
 res.json(data);
});
// 👉 CREATE TICKET
app.post("/tickets", async (req, res) => {
 const { title, description } = req.body;
 const { data, error } = await supabase
   .from("tickets")
   .insert([{ title, description }])
   .select();
 if (error) {
   console.log(error);
   return res.status(500).json({ message: "error creating" });
 }
 console.log("📧 Email sent (demo)");
 res.json(data);
});
// 👉 UPDATE STATUS
app.put("/tickets/:id", async (req, res) => {
 const { id } = req.params;
 const { error } = await supabase
   .from("tickets")
   .update({ status: req.body.status })
   .eq("id", id);
 if (error) {
   console.log(error);
   return res.status(500).json({ message: "error updating" });
 }
 res.json({ message: "updated" });
});
// 👉 DELETE TICKET
app.delete("/tickets/:id", async (req, res) => {
 const { id } = req.params;
 const { error } = await supabase
   .from("tickets")
   .delete()
   .eq("id", id);
 if (error) {
   console.log(error);
   return res.status(500).json({ message: "error deleting" });
 }
 res.json({ message: "deleted" });
});
// 👉 ADD COMMENT
app.post("/tickets/:id/comment", async (req, res) => {
 const { id } = req.params;
 const { comment } = req.body;
 const { data, error } = await supabase
   .from("tickets")
   .select("comments")
   .eq("id", id)
   .single();
 if (error) {
   console.log(error);
   return res.status(500).json({ message: "error fetching comments" });
 }
 const oldComments = data.comments || [];
 const { error: updateError } = await supabase
   .from("tickets")
   .update({ comments: [...oldComments, comment] })
   .eq("id", id);
 if (updateError) {
   console.log(updateError);
   return res.status(500).json({ message: "error adding comment" });
 }
 res.json({ message: "comment added" });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running 🚀"));
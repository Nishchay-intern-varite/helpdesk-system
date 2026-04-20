import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
const app = express();
app.use(cors());
app.use(express.json());
const supabase = createClient(
 "https://jrdfzgulmeimpcjsslii.supabase.co",
 "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyZGZ6Z3VsbWVpbXBjanNzbGlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MDU3ODAsImV4cCI6MjA5MjE4MTc4MH0.YhzXGIu0-Rkdb5VBS9Wb8ORE4IbZaiMjKjDw8Wc0b6Q"
);
// GET
app.get("/tickets", async (req, res) => {
 const { data, error } = await supabase.from("tickets").select("*");
 if (error) {
   console.log(error);
   return res.status(500).json(error);
 }
 res.json(data || []);
});
// CREATE
app.post("/tickets", async (req, res) => {
 const { title, description, email } = req.body;
 const { data, error } = await supabase
   .from("tickets")
   .insert([
     {
       title,
       description,
       status: "Open",
       comments: [],
       user_email: email || "demo@gmail.com"
     }
   ])
   .select();
 if (error) {
   console.log(error);
   return res.status(500).json(error);
 }
 res.json(data);
});
// UPDATE
app.put("/tickets/:id", async (req, res) => {
 await supabase
   .from("tickets")
   .update({ status: "Completed" })
   .eq("id", req.params.id);
 res.json({ message: "updated" });
});
// DELETE
app.delete("/tickets/:id", async (req, res) => {
 await supabase.from("tickets").delete().eq("id", req.params.id);
 res.json({ message: "deleted" });
});
// COMMENT (FINAL FIXED)
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
   return res.status(500).json(error);
 }
 const oldComments = Array.isArray(data.comments) ? data.comments : [];
 const { error: updateError } = await supabase
   .from("tickets")
   .update({
     comments: [...oldComments, comment]
   })
   .eq("id", id);
 if (updateError) {
   console.log(updateError);
   return res.status(500).json(updateError);
 }
 res.json({ message: "comment added" });
});
app.listen(5000, () => console.log("Server running 🚀"));
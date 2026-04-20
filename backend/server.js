import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
const app = express();
app.use(cors());
app.use(express.json());
// 🔴 IMPORTANT: apni anon key yaha daal
const supabase = createClient(
 "https://jrdfzgulmeimpcjsslii.supabase.co",
 "PASTE_YOUR_ANON_KEY_HERE"
);

// ✅ GET ALL TICKETS
app.get("/tickets", async (req, res) => {
 const { data, error } = await supabase
   .from("tickets")
   .select("*")
   .order("id", { ascending: false });
 if (error) {
   console.log(error);
   return res.status(500).json(error);
 }
 res.json(data || []);
});

// ✅ CREATE TICKET
app.post("/tickets", async (req, res) => {
 const { title, description, email, category, priority } = req.body;
 const { data, error } = await supabase
   .from("tickets")
   .insert([
     {
       title,
       description,
       status: "Open",
       category: category || "General",
       priority: priority || "Medium",
       created_by_name: email,
       user_email: email,
       comments: [],
       created_at: new Date()
     }
   ])
   .select();
 if (error) {
   console.log("CREATE ERROR:", error);
   return res.status(500).json(error);
 }
 res.json(data);
});

// ✅ UPDATE STATUS
app.put("/tickets/:id", async (req, res) => {
 const { status } = req.body;
 const { error } = await supabase
   .from("tickets")
   .update({ status })
   .eq("id", req.params.id);
 if (error) {
   console.log(error);
   return res.status(500).json(error);
 }
 res.json({ message: "updated" });
});

// ✅ DELETE
app.delete("/tickets/:id", async (req, res) => {
 const { error } = await supabase
   .from("tickets")
   .delete()
   .eq("id", req.params.id);
 if (error) {
   console.log(error);
   return res.status(500).json(error);
 }
 res.json({ message: "deleted" });
});

// ✅ ADD COMMENT
app.post("/tickets/:id/comment", async (req, res) => {
 const { id } = req.params;
 const { comment } = req.body;
 const { data, error } = await supabase
   .from("tickets")
   .select("comments")
   .eq("id", id)
   .single();
 if (error) return res.status(500).json(error);
 const oldComments = Array.isArray(data?.comments) ? data.comments : [];
 const { error: updateError } = await supabase
   .from("tickets")
   .update({ comments: [...oldComments, comment] })
   .eq("id", id);
 if (updateError) return res.status(500).json(updateError);
 res.json({ message: "comment added" });
});

// 🚀 SERVER START
app.listen(5000, () => console.log("Server running on port 5000 🚀"));
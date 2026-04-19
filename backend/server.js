import express from "express";

import cors from "cors";

import { createClient } from "@supabase/supabase-js";

const app = express();

app.use(cors());

app.use(express.json());

const supabase = createClient(

  "https://jrdfzgulmeimpcjsslii.supabase.co",

  "YOUR_ANON_KEY"

);

// GET

app.get("/tickets", async (req, res) => {

  const { data, error } = await supabase.from("tickets").select("*");

  if (error) return res.status(500).json(error);

  res.json(data);

});

// CREATE

app.post("/tickets", async (req, res) => {

  const { title, description } = req.body;

  const { data, error } = await supabase

    .from("tickets")

    .insert([{ title, description }])

    .select();

  if (error) return res.status(500).json(error);

  res.json(data);

});

// DELETE

app.delete("/tickets/:id", async (req, res) => {

  const { id } = req.params;

  await supabase.from("tickets").delete().eq("id", id);

  res.json({ message: "deleted" });

});

// UPDATE

app.put("/tickets/:id", async (req, res) => {

  const { id } = req.params;

  await supabase

    .from("tickets")

    .update({ status: req.body.status })

    .eq("id", id);

  res.json({ message: "updated" });

});

// COMMENT

app.post("/tickets/:id/comment", async (req, res) => {

  const { id } = req.params;

  const { comment } = req.body;

  const { data } = await supabase

    .from("tickets")

    .select("comments")

    .eq("id", id)

    .single();

  const old = data.comments || [];

  await supabase

    .from("tickets")

    .update({ comments: [...old, comment] })

    .eq("id", id);

  res.json({ message: "comment added" });

});

app.listen(5000, () => console.log("Server running"));
 
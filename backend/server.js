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

// ✅ GET ALL

app.get("/tickets", async (req, res) => {

  try {

    const { data, error } = await supabase.from("tickets").select("*");

    if (error) {

      console.log(error);

      return res.json([]);

    }

    res.json(data || []);

  } catch (err) {

    console.log(err);

    res.json([]);

  }

});

// ✅ CREATE (FINAL FIX)

app.post("/tickets", async (req, res) => {

  try {

    const { title, description, email } = req.body;

    console.log("CREATE DATA:", title, description, email);

    const { data, error } = await supabase

      .from("tickets")

      .insert([

        {

          title: title || "No title",

          description: description || "No desc",

          status: "Open",

          comments: [],

          user_email: email || "unknown"

        }

      ])

      .select();

    if (error) {

      console.log("SUPABASE ERROR:", error);

      return res.json([]);

    }

    res.json(data);

  } catch (err) {

    console.log("SERVER ERROR:", err);

    res.json([]);

  }

});

// ✅ DELETE

app.delete("/tickets/:id", async (req, res) => {

  await supabase.from("tickets").delete().eq("id", req.params.id);

  res.json({ message: "deleted" });

});

// ✅ UPDATE

app.put("/tickets/:id", async (req, res) => {

  await supabase

    .from("tickets")

    .update({ status: req.body.status })

    .eq("id", req.params.id);

  res.json({ message: "updated" });

});

// ✅ COMMENT

app.post("/tickets/:id/comment", async (req, res) => {

  const { id } = req.params;

  const { comment } = req.body;

  const { data } = await supabase

    .from("tickets")

    .select("comments")

    .eq("id", id)

    .single();

  const old = data?.comments || [];

  await supabase

    .from("tickets")

    .update({ comments: [...old, comment] })

    .eq("id", id);

  res.json({ message: "comment added" });

});

app.listen(5000, () => console.log("Server running 🚀"));
 
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const sqlite = require("sqlite3").verbose();
const {open} = require("sqlite");

app.use(cors());
app.use(express.json());

const dbpath = path.join(__dirname, "aspiresql.db");

let db = null;


const initializeDBAndServer = async () => {
  try {
    db = await open({
        filename: dbpath,
        driver: sqlite.Database
    });
    app.listen(5000, () => {
        console.log("Server Running at http://localhost:5000");
    }
    );
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();



// GET /colleges with filters & search
app.get("/colleges", async (req, res) => {
  try {
    const { location, course, minFee, maxFee, search, sort } = req.query;

    let query = "SELECT * FROM colleges WHERE 1=1";
    let params = [];

    if (location) {
      query += " AND location = ?";
      params.push(location);
    }
    if (course) {
      query += " AND course = ?";
      params.push(course);
    }
    if (minFee) {
      query += " AND fee >= ?";
      params.push(minFee);
    }
    if (maxFee) {
      query += " AND fee <= ?";
      params.push(maxFee);
    }
    if (search) {
      query += " AND name LIKE ?";
      params.push(`%${search}%`);
    }
    if (sort === "asc") {
      query += " ORDER BY fee ASC";
    } else if (sort === "desc") {
      query += " ORDER BY fee DESC";
    }

    const rows = await db.all(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post("/reviews", async (req, res) => {
  try {
    const { college_id, college_name, rating, comment } = req.body;
    if (!college_id || !college_name || !rating) {
      return res.status(400).json({ error: "college_id, college_name and rating are required" });
    }

    const sql = `INSERT INTO reviews (college_id, college_name, rating, comment) VALUES (?, ?, ?, ?)`;
    const result = await db.run(sql, [college_id, college_name, rating, comment]);

    res.status(201).json({
      id: result.lastID,
      college_id,
      college_name,
      rating,
      comment
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/reviews", async (req, res) => {
  try {
    const sql = `SELECT * FROM reviews ORDER BY created_at DESC`;
    const rows = await db.all(sql);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Add a college to favorites
app.post("/favorites", (req, res) => {
  const { college_id, user_id } = req.body;

  if (!college_id || !user_id) {
    return res.status(400).json({ error: "college_id and user_id are required" });
  }

  const sql = `INSERT INTO favorites (college_id, user_id) VALUES (?, ?)`;
  db.run(sql, [college_id, user_id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({
      id: this.lastID,   
      college_id,
      user_id,
    });
  });
});

// Get all favorite colleges for a user
app.get("/favorites/:user_id", (req, res) => {
  const { user_id } = req.params;

  const sql = `
    SELECT f.id AS favorite_id, c.*
    FROM favorites f
    JOIN colleges c ON f.college_id = c.id
    WHERE f.user_id = ?
  `;
  db.all(sql, [user_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Remove a college from favorites 
app.delete("/favorites/:user_id/:favorite_id", (req, res) => {
  const { user_id, favorite_id } = req.params;

  const sql = `DELETE FROM favorites WHERE id = ? AND user_id = ?`;
  db.run(sql, [favorite_id, user_id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Favorite not found" });

    res.json({ message: "Favorite removed successfully" });
  });
});




module.exports = app;

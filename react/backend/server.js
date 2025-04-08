const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let sessions = [];

app.get("/api/sessions", (req, res) => {
    res.json(sessions);
});

app.post("/api/sessions", (req, res) => {
    const newSession = { ...req.body, id: Date.now(), attended: false };
    sessions.push(newSession);
    res.status(201).json(newSession);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

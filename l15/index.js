require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const Faculty = require("./models/Faculty");
const Pulpit = require("./models/Pulpit");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

// ========== FACULTIES ==========
app.get("/api/faculties", async (req, res) => {
    try {
        const faculties = await Faculty.find();
        res.json(faculties);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/api/faculties", async (req, res) => {
    try {
        const faculty = await Faculty.create(req.body);
        res.json(faculty);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put("/api/faculties", async (req, res) => {
    try {
        const updated = await Faculty.findOneAndUpdate(
            { faculty: req.body.faculty },
            req.body,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ error: `Faculty '${req.body.faculty}' not found` });
        }

        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete("/api/faculties/:id", async (req, res) => {
    try {
        const deleted = await Faculty.findOneAndDelete({ faculty: req.params.id });

        if (!deleted) {
            return res.status(404).json({ error: `Faculty '${req.params.id}' not found` });
        }

        const result = await Pulpit.deleteMany({ faculty: req.params.id });

        res.json({
            message: `Faculty '${req.params.id}' and ${result.deletedCount} related pulpits deleted`,
            deletedFaculty: deleted
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// ========== PULPITS ==========
app.get("/api/pulpits", async (req, res) => {
    try {
        const pulpits = await Pulpit.find();
        res.json(pulpits);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/api/pulpits", async (req, res) => {
    try {
        const { faculty } = req.body;

        const facultyExists = await Faculty.findOne({ faculty });

        if (!facultyExists) {
            return res.status(400).json({ error: `Faculty '${faculty}' does not exist` });
        }

        const pulpit = await Pulpit.create(req.body);
        res.json(pulpit);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put("/api/pulpits", async (req, res) => {
    try {
        const { faculty, pulpit } = req.body;

        const facultyExists = await Faculty.findOne({ faculty });
        if (!facultyExists) {
            return res.status(400).json({ error: `Faculty '${faculty}' does not exist` });
        }

        const updated = await Pulpit.findOneAndUpdate(
            { pulpit },
            req.body,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ error: `Pulpit '${pulpit}' not found` });
        }

        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete("/api/pulpits/:id", async (req, res) => {
    try {
        const deleted = await Pulpit.findOneAndDelete({ pulpit: req.params.id });

        if (!deleted) {
            return res.status(404).json({ error: `Pulpit '${req.params.id}' not found` });
        }

        res.json({ message: `Pulpit '${req.params.id}' deleted`, deleted });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// ========== START SERVER ==========
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

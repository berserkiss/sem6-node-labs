// models/Faculty.js
const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
    faculty: { type: String, required: true, unique: true },
    faculty_name: { type: String, required: true }
});

module.exports = mongoose.model("Faculty", facultySchema);

// models/Pulpit.js
const mongoose = require("mongoose");

const pulpitSchema = new mongoose.Schema({
    pulpit: { type: String, required: true, unique: true },
    pulpit_name: { type: String, required: true },
    faculty: { type: String, required: true }
});

module.exports = mongoose.model("Pulpit", pulpitSchema);



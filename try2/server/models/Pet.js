const mongoose = require("mongoose");

const petSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    breed: { type: String },
    age: { type: Number, required: true },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    status: {
        type: String,
        enum: ["available", "pending", "adopted"],
        default: "available"
    },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Pet", petSchema);
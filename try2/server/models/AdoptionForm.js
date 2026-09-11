const mongoose = require("mongoose");


const adoptionFormSchema = new mongoose.Schema({
    pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    livingSituation: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    previousExperience: { type: String, required: true },
    familyComposition: { type: String, required: true },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    }
}, { timestamps: true });

module.exports = mongoose.model("AdoptionForm", adoptionFormSchema);

const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, "Please add a company"],
    maxLength: [50, "Company name cannot be more than 50 characters"],
  },
  position: {
    type: String,
    required: [true, "Please add a position"],
    maxLength: [150, "Position name cannot be more than 150 characters"],
  },
  status: {
    type: String,
    enum: ["interview", "declined", "pending"],
    default: "pending",
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Please add a user"],
  },
}, { timestamps: true });

module.exports = mongoose.model("Job", JobSchema);
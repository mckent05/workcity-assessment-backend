const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: 
  { type: String, 
    required: true },
  description: String,
  client: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Client', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'in-progress', 'completed'], 
    default: 'pending' }
});
const Project = mongoose.model('Project', projectSchema);
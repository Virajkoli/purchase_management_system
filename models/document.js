// models/Document.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Who uploaded it
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    }, // Workflow status
    approvers: [
      {
        role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' }, // Roles that need to approve
        approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // User who approved/rejected
        status: { type: String, enum: ['Approved', 'Rejected'], default: null },
      },
    ],
    filePath: { type: String, required: true }, // Path to the uploaded file
  },
  { timestamps: true }
);

module.exports = mongoose.model('Document', documentSchema);

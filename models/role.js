// models/Role.js
const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ['Superadmin', 'Teacher', 'HOD', 'Office Superintendent', 'Registrar', 'Principal'],
    },
    permissions: {
        type: [String],
        required: true, // Define permissions like ['create_tender', 'view_document', etc.]
    },
});

module.exports = mongoose.model('Role', roleSchema);

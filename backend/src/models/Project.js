const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['ongoing', 'completed', 'pending'],
        default: 'ongoing'
    },
    expectedResults: {
        type: String
    },
    documents: [{
        title: String,
        fileUrl: String,
        uploadDate: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
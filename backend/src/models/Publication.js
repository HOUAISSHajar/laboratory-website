const mongoose = require('mongoose');

const publicationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    authors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    type: {
        type: String,
        enum: ['article', 'book_chapter', 'thesis', 'conference_paper'],
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    journal: {
        type: String
    },
    doi: {
        type: String
    },
    abstract: {
        type: String
    },
    keywords: [{
        type: String
    }],
    fileUrl: {
        type: String
    }
}, { timestamps: true });

const Publication = mongoose.model('Publication', publicationSchema);
module.exports = Publication;
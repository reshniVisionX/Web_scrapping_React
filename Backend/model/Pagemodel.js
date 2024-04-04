const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    data: {
        type: Buffer,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Page = mongoose.model('Page', pageSchema);

module.exports = Page;

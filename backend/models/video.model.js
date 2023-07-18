// Import Mongoose
const mongoose = require("mongoose");

// Define the schema for the 'video' collection
const schema = mongoose.Schema({
    title: String,
    channelTitle: String,
    description: String,
    thumbnailURL: String,
    publishedAt: Date
});

// Create a VideoModel based on the schema
const VideoModel = mongoose.model('video', schema);

// Exported VideoModel
module.exports = {
    VideoModel
};

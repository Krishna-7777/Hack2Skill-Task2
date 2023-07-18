// Import necessary modules
const express = require("express");
require("dotenv").config(); // Load environment variables
const { VideoModel } = require("../models/video.model"); // Import VideoModel from video.model.js

const videoRouter = express.Router(); // Create a new Router instance for video routes

// Function to extract relevant data from fetched data
function extractData(item) {
    return {
        channelTitle: item.snippet.channelTitle,
        thumbnailURL: item.snippet.thumbnails.medium.url,
        publishedAt: item.snippet.publishedAt,
        description: item.snippet.description,
        title: item.snippet.title,
    };
}

// Scheduled a periodic task every 30 seconds to fetch data from YouTube API and store in DB
setInterval(async () => {
    // Calculate the date 30 minutes ago in ISO format
    let date = new Date(new Date().getMinutes() - 30).toISOString();

    // Fetch new videos from YouTube API published after the calculated date
    setTimeout(async () => {
        try {
            let data = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&order=date&publishedAfter=${date}&safeSearch=moderate&type=video&key=${process.env.key}`);
            data = await data.json();
            if (data.items.length) {
                // Extract and insert the fetched data into the VideoModel collection
                const extractedData = data.items.map((item) => extractData(item));
                await VideoModel.insertMany(extractedData);
                console.log("data inserted");
            }
        } catch (error) {
            console.log(error);
        }
    }, 30000);
}, 30000);

// Route to fetch paginated video data
videoRouter.get('/videos', async (ask, give) => {
    const page = parseInt(ask.query.page) || 1;
    const limit = parseInt(ask.query.limit) || 10;

    try {
        // Get total number of videos and calculate total pages
        const totalVideos = await VideoModel.countDocuments();
        const totalPages = Math.ceil(totalVideos / limit);

        // Fetch videos with pagination and sort by publishedAt in descending order
        const videos = await VideoModel.find()
            .sort({ publishedAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        // Respond with paginated video data
        give.send({
            totalVideos,
            totalPages,
            currentPage: page,
            videos,
        });
    } catch (err) {
        console.error('Error while fetching video data:', err);
        give.status(500).send({ error: 'Internal server error' });
    }
});

// Route to search videos based on a query
videoRouter.get('/search', async (ask, give) => {
    const searchQuery = ask.query.q;
    const limitQuery = parseInt(ask.query.limit) || 5;

    // Check if search query parameter "q" is provided
    if (!searchQuery) {
        return give.status(400).send({ error: 'Search query parameter "q" is required' });
    }

    try {
        // Search videos with title or description matching the search query, limited by the given limit
        const searchResult = await VideoModel.find({
            $or: [
                { title: { $regex: searchQuery, $options: 'i' } },
                { description: { $regex: searchQuery, $options: 'i' } },
            ],
        }).limit(limitQuery);

        // Respond with the search results
        give.send({ results: searchResult });
    } catch (err) {
        console.error('Error while searching for videos:', err);
        give.status(500).send({ error: 'Internal server error' });
    }
});

module.exports = {
    videoRouter
};

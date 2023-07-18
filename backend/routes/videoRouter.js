const express = require("express");
require("dotenv").config()
const { VideoModel } = require("../models/video.model");

const videoRouter = express.Router();

function extractData(item) {
    return {
        channelTitle: item.snippet.channelTitle,
        thumbnailURL: item.snippet.thumbnails.medium.url,
        publishedAt: item.snippet.publishedAt,
        description: item.snippet.description,
        title: item.snippet.title,
    };
}

setInterval(async () => {
    let date = new Date(new Date().getMinutes() - 30).toISOString()
    setTimeout(async () => {
        try {
            let data = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&order=date&publishedAfter=${date}&safeSearch=moderate&type=video&key=${process.env.key}`);
        data = await data.json()
        if (data.items.length) {
            const extractedData = data.items.map((item) => extractData(item));
            await VideoModel.insertMany(extractedData)
            console.log("data inserted")
        }
        } catch (error) {
            console.log(error)
        }
        
    }, 30000)
}, 30000)

videoRouter.get('/videos', async (ask, give) => {
    const page = parseInt(ask.query.page) || 1;
    const limit = parseInt(ask.query.limit) || 10;

    try {
        const totalVideos = await VideoModel.countDocuments();
        const totalPages = Math.ceil(totalVideos / limit);
        const videos = await VideoModel.find()
            .sort({ publishedAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

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

  videoRouter.get('/search', async (ask, give) => {
    const searchQuery = ask.query.q;
    const limitQuery = parseInt(ask.query.limit) || 5

    if (!searchQuery) {
        return give.status(400).send({ error: 'Search query parameter "q" is required' });
    }

    try {
        const searchResult = await VideoModel.find({
            $or: [
                { title: { $regex: searchQuery, $options: 'i' } }, 
                { description: { $regex: searchQuery, $options: 'i' } }, 
            ],
        }).limit(limitQuery);

        give.send({ results: searchResult });
    } catch (err) {
        console.error('Error while searching for videos:', err);
        give.status(500).send({ error: 'Internal server error' });
    }
});

module.exports = {
    videoRouter
}
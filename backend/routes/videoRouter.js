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
    let date =new Date(new Date().getMinutes()-30).toISOString()
    setTimeout(async () => {
        let data = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&order=date&publishedAfter=${date}&safeSearch=moderate&type=video&key=${process.env.key}`);
        data = await data.json()
        if(data.items.length){
            const extractedData = data.items.map((item) => extractData(item));
        await VideoModel.insertMany(extractedData)
        console.log("data inserted")
        }
    }, 30000)
}, 30000)

module.exports = {
    videoRouter
}
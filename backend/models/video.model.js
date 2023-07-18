const { default: mongoose } = require("mongoose");

const schema = mongoose.Schema({
    title:String,
    channelTitle: String,
    description: String,
    thumbnailURL: String,
    publishedAt:Date
});

const VideoModel=mongoose.model('video',schema);

module.exports={
    VideoModel
}
const { default: mongoose } = require("mongoose");

const schema = mongoose.Schema({
    title: String,
    description: String,
    thumbnail: String,
    date:Date
});

const VideoModel=mongoose.model('video',schema);

module.exports={
    VideoModel
}
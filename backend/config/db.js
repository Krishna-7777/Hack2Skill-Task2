// Import necessary modules
const mongoose = require("mongoose");
require("dotenv").config(); 
// Load environment variables

// Connect to the database using the provided DBURL
const connect = mongoose.connect(process.env.DBURL);

// Export the connect for db connection
module.exports = {
    connect
};

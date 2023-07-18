// Import necessary modules
const express = require("express");
const cors = require("cors");

// Import database connection function and videoRouter
const { connect } = require("./config/db");
const { videoRouter } = require("./routes/videoRouter");

const app = express(); // Create an Express app 

app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
app.use(express.json()); // Parse incoming JSON data

// Default route 
app.get('/', (ask, give) => {
    give.send('This is Task 2.');
});

// Route middleware to handle video-related routes
app.use('/api', videoRouter);

// Start the server and establish a connection to the database
app.listen(3000, () => {
    try {
        connect // Making database connection 
        console.log(`Connected to the DB and server is running at 3000`);
    } catch (error) {
        console.log(error);
        console.log("Error in connecting to the DB");
    }
});

const express = require("express");
const cors = require("cors");

const { connect } = require("./config/db");
const { videoRouter } = require("./routes/videoRouter");

const app = express();
app.use(cors());
app.use(express.json())

app.get('/', (ask, give) => {
    give.send('This is Task 2.')
})

app.use('/api', videoRouter)

app.listen(3000, () => {
    try {
        connect
        console.log(`Connected to the DB and server is running at 3000`)
    } catch (error) {
        console.log(error);
        console.log("Error in connecting to the DB")
    }
})
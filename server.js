const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")

require("dotenv").config()

const app = express()
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

mongoose.connect(uri, {useCreateIndex: true, useUnifiedTopology: true, useNewUrlParser: true})

const connection = mongoose.connection

connection.once('open', () => {
    console.log("MongoDB connection established")
})

const userRouter = require('./routes/user')
const answerRouter = require('./routes/answer')
const adminRouter = require('./routes/admin')
app.use('/users',userRouter)
app.use('/answer',answerRouter)
app.use('/admin',adminRouter)

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})
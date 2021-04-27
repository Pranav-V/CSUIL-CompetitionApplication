const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000
console.log("here")
app.use(cors())
app.use(express.json())

app.use(express.static(path.join(__dirname, 'client/build/')))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/'))
})

console.log('here')
mongoose.connect("mongodb+srv://pnav:pdatabase@cluster0.jvhte.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
const connection = mongoose.connection
connection.once('open', () => {
    console.log('MongoDB connection established')
})

const userRouter = require('./routes/user')
const answerRouter = require('./routes/answer')
const adminRouter = require('./routes/admin')
const teamRouter = require('./routes/team')

app.use('/team',teamRouter)
app.use('/users',userRouter)
app.use('/answer',answerRouter)
app.use('/admin',adminRouter)

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})
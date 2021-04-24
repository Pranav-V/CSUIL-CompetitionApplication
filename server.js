const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const crypto = require('crypto');
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

const storage = new GridFsStorage({
    url: "mongodb+srv://pnav:pdatabase@cluster0.jvhte.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    options: {useNewUrlParser: true, useUnifiedTopology: true},
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});

const upload = multer({ storage });



const userRouter = require('./routes/user')
const imageRouter = require('./routes/image');
const answerRouter = require('./routes/answer')
const adminRouter = require('./routes/admin')
app.use('/users',userRouter)
app.use('/answer',answerRouter)
app.use('/admin',adminRouter)
app.use('/image', imageRouter(upload));

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})
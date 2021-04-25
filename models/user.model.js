
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true}, 
    team: {type: Number, required: true}, 
    name: {type: String, required: true},
    isAdmin: {type:Boolean, required: true},
    hasTakenMC: {type:Boolean, required: true},
    hasTakenWritten: {type:Boolean, required:true},
    timeStarted: {type:Date,required:true},
    iScore: {type:Number, required: true}, 
    iScoreinfo: {type:String}
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema)

module.exports = User
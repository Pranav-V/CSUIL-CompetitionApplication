const mongoose = require('mongoose')
const Schema = mongoose.Schema

const answerSchema = new Schema({
    frqID: {type:String, required:true},
    answers: {type:String, required:true},
    frqNames: {type:String, required:true}
}, {
    timestamps: true
})

const Answer = mongoose.model('Answer', answerSchema)

module.exports = Answer
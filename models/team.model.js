
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const teamSchema = new Schema({
    team: {type: Number, required: true}, 
    frqAnswers: {type: Object, required:true},
    wScore: {type:Number, required:true},
    teamScore: {type:Number,require:true}

}, {
    timestamps: true
})

const Team = mongoose.model('Team', teamSchema)

module.exports = Team
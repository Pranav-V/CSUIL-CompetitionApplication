const mongoose = require('mongoose')
const Schema = mongoose.Schema

const adminSchema = new Schema({
    MCtestEnabled: {type:Boolean,required:true},
    WrittentestEnabled: {type:Boolean,required:true},
    currentTeamCount : {type:Number,required:true}
}, {
    timestamps: true
})

const Admin = mongoose.model('Admin', adminSchema)

module.exports = Admin
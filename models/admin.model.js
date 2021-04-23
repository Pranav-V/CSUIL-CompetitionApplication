const mongoose = require('mongoose')
const Schema = mongoose.Schema

const adminSchema = new Schema({
    MCtestEnabled: {type:Boolean,required:false}
}, {
    timestamps: true
})

const Admin = mongoose.model('Admin', adminSchema)

module.exports = Admin
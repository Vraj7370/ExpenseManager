const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true
    },
    age:{
        type:Number
    },
    gender:{
        type:String,
        enum:["Male","Female","Other"]
    },
    profilePic:{
        type:String
    },
    status:{
        type:String,
        enum:["Active" , "Not Active"],
        default:"Active"
    },
    resetPasswordToken:{
        type:String
    },
    resetPasswordExpires:{
        type:Date
    }
})
module.exports =mongoose.model("users",userSchema)

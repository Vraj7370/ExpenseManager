const mongoose = require("mongoose")

const DBConnection = ()=>{

    mongoose.connect("mongodb://127.0.0.1/24_fullday_exp").then(()=>{
        console.log("database conneced..")
    }).catch((err)=>{
        console.log("error while connecting db..")
    })

}
module.exports = DBConnection
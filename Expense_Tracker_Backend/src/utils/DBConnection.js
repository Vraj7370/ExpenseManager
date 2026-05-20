const mongoose = require("mongoose")

const DBConnection = ()=>{

    const dbUri = process.env.MONGODB_URI || "mongodb://127.0.0.1/24_fullday_exp";
    mongoose.connect(dbUri).then(()=>{
        console.log("database conneced..")
    }).catch((err)=>{
        console.log("error while connecting db..", err)
    })

}
module.exports = DBConnection
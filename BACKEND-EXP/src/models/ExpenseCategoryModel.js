const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const expCategorySchema = new Schema({

    catName:{
        type:String
    },
    description:{
        type:String
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"users"
    }

})
module.exports = mongoose.model("expCategory",expCategorySchema)
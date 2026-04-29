const mongoose = require("mongoose")
const Schema = mongoose.Schema

const expenseSchema = new Schema({
    title:{
        type:String
    },
    description:{
        type:String
    },
    amount:{
        type:Number
    },
    expenseDate:{
        type:Date,
        default:new Date()
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"users"
    },
    expCat:{
        type:Schema.Types.ObjectId,
        ref:"expCategory"
    },
    expReceipt:{
        type:String
    },
    paymentMode:{
        type:String,
        enum:["UPI","CASH","CARD","CHECK","EMI"]
    },
})
module.exports = mongoose.model("expense",expenseSchema)
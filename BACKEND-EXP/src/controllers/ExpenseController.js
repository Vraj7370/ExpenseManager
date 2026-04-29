const expenseSchema = require("../models/ExpenseModel")

const createExpense = async(req,res)=>{


    try{

        const userId = req.user._id;
        const savedExpense = await expenseSchema.create({...req.body,userId:userId})
        res.status(201).json({
            message:"expense created..",
            data:savedExpense
        })


    }catch(err){

        res.status(500).json({
            message:"error while creating expense.."
        })
    }


}
const getExpesneByUserId = async(req,res)=>{

    const userId = req.user._id;
    const expenses = await expenseSchema.find({userId:userId})
    res.status(200).json({
        message:"expense",
        data:expenses
    })
}
module.exports={
    createExpense,
    getExpesneByUserId
}
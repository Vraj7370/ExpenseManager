const expenseSchema = require("../models/ExpenseModel")
const { uploadToCloudinary } = require("../utils/CloudinaryUtil")
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
    var sort = req.query.sort || 1;
    sort = parseInt(sort);
    var datesort = req.query.date || 1
    datesort = parseInt(datesort);
    console.log(datesort)
 const type = req.query.type || "expense"
    let expenses;
    if(type =="expense"){
        //if type is expense then  fetch title description amount expDate paymentMode expCat     
        //fetch only thoese data where income filed is not there
         expenses = await expenseSchema.find({userId:userId,income:{$exists:false}},["title","description","amount","expenseDate","paymentMode","expCat"]).populate("expCat").sort({amount:sort,expenseDate:datesort})
    }
    else{
        //if type is income then fetch title description incomeCategory income expDate
        ////fetch only thoese data where expense filed is not there
         expenses = await expenseSchema.find({userId:userId,amount:{$exists:false}},["title","description","income","expenseDate","incomeCategory","paymentMode"]).populate("incomeCategory").sort({income:sort,expenseDate:datesort})
    }    console.log(
            expenses.map(e => e.expenseDate)
        );
    res.status(200).json({
        message:"expense",
        data:expenses
    })
}
const deleteExpense = async(req,res)=>{
    try{
        const userId = req.user._id;
        const id = req.params.id;
        const expense = await expenseSchema.findOneAndDelete({_id:id,userId:userId});
        if(!expense){
            return res.status(404).json({
                message:"expense not found"
            })
        }
        res.status(200).json({
            message:"expense deleted",
            data:expense
        })
    }catch(err){
        res.status(500).json({
            message:"error while deleting expense",
            err:err.message
        })
    }
}
const searchExp = async (req, res) => {
    try {
        const userId = req.user._id;
        const expName = req.query.expName || "";
        let expAmount = req.query.expAmount || "";

        if (expAmount) {
            expAmount = parseInt(expAmount);
        }

        let query = { userId };

        if (expName) {
            query.$or = [
                { title: { $regex: expName, $options: "i" } },
                { description: { $regex: expName, $options: "i" } }
            ];
        }

        if (expAmount) {
            query.amount = expAmount; // ✅ separate filter
        }

        const foundexp = await expenseSchema.find(query).populate("expCat");

        res.json({
            message: "search successful",
            data: foundexp
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "error while searching expense"
        });
    }
};
const uploadReceipt = async(req,res)=>{

    const expId = req.body.expId;
    const file = req.file;

    if(!file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    //clodudiary upload --> req.file.path
    //return cloudinaryResponse --> secure_url
    const cloudinaryResponse = await uploadToCloudinary(file.path);
    
    if (!cloudinaryResponse) {
        return res.status(500).json({ message: "Error uploading to cloudinary" });
    }

    const updateExp = await expenseSchema.findByIdAndUpdate(expId,{expReceipt:cloudinaryResponse.secure_url})
    res.status(200).json({
        message:"receipt uploaded successfully",
        data:updateExp
    })


}

module.exports={
    createExpense,
    getExpesneByUserId,
    deleteExpense,
    searchExp,
    uploadReceipt
}

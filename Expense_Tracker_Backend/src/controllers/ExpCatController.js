const expCategory = require("../models/ExpenseCategoryModel")
const createExpenseCategory = async(req,res)=>{

    try{

        console.log("req.user...",req.user)
        //const savedExp = await expCategory.create(req.body) //tile,description,token
       const savedExp = await expCategory.create({...req.body,userId:req.user._id}) //tile,description,token 
        res.status(201).json({
            message:"expCat saved..",
            cat:savedExp
        })
    }catch(err){
        res.status(201).json({
            message:"errow while saving expCat ",
            err:err
        })

    }

}

const getExpensecategoriesByUserId = async(req,res)=>{

    const userId = req.user._id;
    const categories = await expCategory.find({userId:userId})
    res.status(200).json({
        data:categories
    })

}

const deleteMyCategory = async(req,res)=>{
    try {
        const deletedCategory = await expCategory.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        })

        if (!deletedCategory) {
            return res.status(404).json({
                message:"category not found"
            })
        }

        res.status(200).json({
            message:"category deleted successfully",
            data:deletedCategory
        })
    }
    catch(err)
    {
        res.status(500).json({
            message:"category is not deleted",
            err:err.message
        })
    } 
}

const updateMyCategory = async (req, res) => {
    try {
        const { catName, description } = req.body

        if (!catName || !String(catName).trim()) {
            return res.status(400).json({
                message: "Category name is required"
            })
        }

        const updatedCategory = await expCategory.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            {
                catName: String(catName).trim(),
                description: description ? String(description).trim() : ""
            },
            { new: true, runValidators: true }
        )

        if (!updatedCategory) {
            return res.status(404).json({
                message: "category not found"
            })
        }

        res.status(200).json({
            message: "category updated successfully",
            data: updatedCategory
        })
    } catch (err) {
        res.status(500).json({
            message: "error while updating category",
            err: err.message
        })
    }
}


module.exports = {
    createExpenseCategory,
    getExpensecategoriesByUserId,
    deleteMyCategory,
    updateMyCategory
}

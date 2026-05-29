const incomeCategory = require("../models/IncomeCategoryModel")

const createIncomeCategory = async(req,res)=>{

    try{

        console.log("req.user...",req.user)
        //const savedInc = await incomeCategory.create(req.body) //tile,description,token
       const savedInc = await incomeCategory.create({...req.body,userId:req.user._id}) //tile,description,token 
        res.status(201).json({
            message:"incCat saved..",
            cat:savedInc
        })
    }catch(err){
            res.status(201).json({
            message:"error while saving incCat ",
            err:err
        })

    }

}

const getIncomecategoriesByUserId = async(req,res)=>{

    const userId = req.user._id;
    const categories = await incomeCategory.find({userId:userId})
    res.status(200).json({
        data:categories
    })

}

const deleteMyCategory = async(req,res)=>{

    const catid = req.params.id
    try{

        const deletedCategory = await incomeCategory.findOneAndDelete({
            _id: catid,
            userId: req.user._id
        })

        if (!deletedCategory) {
            return res.status(404).json({
                message:"category not found"
            })
        }

        res.status(200).json({
            message:"cat deleted..",
            data:deletedCategory
        })

    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"error while deleting category",
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

        const updatedCategory = await incomeCategory.findOneAndUpdate(
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
    createIncomeCategory,
    getIncomecategoriesByUserId,
    deleteMyCategory,
    updateMyCategory
}

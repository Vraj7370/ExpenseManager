const budgetSchema = require("../models/BudgetModel")

const createBudget = async (req, res) => {
    try {
        const userId = req.user._id

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                message: "Request body missing. In Postman: Body → raw → JSON"
            })
        }

        const { maxAmount, createdDate, endDate, exceedDate, budgetStatus } = req.body

        if (maxAmount === undefined || maxAmount === null) {
            return res.status(400).json({
                message: "maxAmount is required"
            })
        }

        const savedBudget = await budgetSchema.create({
            userId,
            maxAmount,
            createdDate: createdDate || new Date(),
            endDate,
            exceedDate,
            budgetStatus: budgetStatus || "active"
        })

        res.status(201).json({
            message: "budget created..",
            data: savedBudget
        })
    } catch (err) {
        res.status(500).json({
            message: "error while creating budget..",
            err: err.message
        })
    }
}

const getBudgetsByUserId = async (req, res) => {
    try {
        const userId = req.user._id
        const budgets = await budgetSchema.find({ userId })

        res.status(200).json({
            message: "budgets fetched..",
            data: budgets
        })
    } catch (err) {
        res.status(500).json({
            message: "error while fetching budgets..",
            err: err.message
        })
    }
}

const getBudgetById = async (req, res) => {
    try {
        const userId = req.user._id
        const id = req.params.id

        const budget = await budgetSchema.findOne({ _id: id, userId })

        if (!budget) {
            return res.status(404).json({
                message: "budget not found"
            })
        }

        res.status(200).json({
            message: "budget fetched..",
            data: budget
        })
    } catch (err) {
        res.status(500).json({
            message: "error while fetching budget..",
            err: err.message
        })
    }
}

const updateBudget = async (req, res) => {
    try {
        const userId = req.user._id
        const id = req.params.id
        const { maxAmount, createdDate, endDate, exceedDate, budgetStatus } = req.body
        const updateFields = {}

        if (maxAmount !== undefined) updateFields.maxAmount = maxAmount
        if (createdDate !== undefined) updateFields.createdDate = createdDate
        if (endDate !== undefined) updateFields.endDate = endDate
        if (exceedDate !== undefined) updateFields.exceedDate = exceedDate
        if (budgetStatus !== undefined) updateFields.budgetStatus = budgetStatus

        const updatedBudget = await budgetSchema.findOneAndUpdate(
            { _id: id, userId },
            updateFields,
            { new: true, runValidators: true }
        )

        if (!updatedBudget) {
            return res.status(404).json({
                message: "budget not found"
            })
        }

        res.status(200).json({
            message: "budget updated..",
            data: updatedBudget
        })
    } catch (err) {
        res.status(500).json({
            message: "error while updating budget..",
            err: err.message
        })
    }
}

const deleteBudget = async (req, res) => {
    try {
        const userId = req.user._id
        const id = req.params.id

        const deletedBudget = await budgetSchema.findOneAndDelete({ _id: id, userId })

        if (!deletedBudget) {
            return res.status(404).json({
                message: "budget not found"
            })
        }

        res.status(200).json({
            message: "budget deleted..",
            data: deletedBudget
        })
    } catch (err) {
        res.status(500).json({
            message: "error while deleting budget..",
            err: err.message
        })
    }
}

module.exports = {
    createBudget,
    getBudgetsByUserId,
    getBudgetById,
    updateBudget,
    deleteBudget
}

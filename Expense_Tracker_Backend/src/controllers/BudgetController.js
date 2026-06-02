const budgetSchema = require("../models/BudgetModel")
const expenseSchema = require("../models/ExpenseModel")
const mongoose = require("mongoose")

const toDate = (value) => {
    if (!value) return null
    const d = new Date(value)
    return Number.isNaN(d.getTime()) ? null : d
}

// Make date-range matching stable for "date-only" inputs coming from <input type="date">
// We treat the range as inclusive for the whole day in UTC.
const startOfDayUTC = (date) => {
    const d = new Date(date)
    d.setUTCHours(0, 0, 0, 0)
    return d
}

const endOfDayUTC = (date) => {
    const d = new Date(date)
    d.setUTCHours(23, 59, 59, 999)
    return d
}

const buildExpenseDateFilter = (budget) => {
    const filter = {}
    const start = toDate(budget.createdDate)
    const end = toDate(budget.endDate)
    if (start) filter.$gte = startOfDayUTC(start)
    if (end) filter.$lte = endOfDayUTC(end)
    return Object.keys(filter).length ? filter : null
}

const getSpentForBudget = async (userId, budget) => {
    const query = {
        userId: mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : userId,
        amount: { $type: "number", $gt: 0 },
        $or: [{ income: { $exists: false } }, { income: null }]
    }
    const dateFilter = buildExpenseDateFilter(budget)
    const pipeline = [{ $match: query }]

    // Some datasets may have `expenseDate` stored as string; normalize to Date for matching.
    pipeline.push({
        $addFields: {
            __expenseDate: { $toDate: "$expenseDate" }
        }
    })

    if (dateFilter) {
        pipeline.push({ $match: { __expenseDate: dateFilter } })
    }

    pipeline.push({ $group: { _id: null, total: { $sum: "$amount" } } })

    const result = await expenseSchema.aggregate(pipeline)

    return result[0]?.total || 0
}

const attachUsage = async (budget, userId) => {
    const spent = await getSpentForBudget(userId, budget)
    const maxAmount = budget.maxAmount || 0
    const remaining = Math.max(0, maxAmount - spent)
    const percentUsed = maxAmount > 0 ? Math.min(100, Math.round((spent / maxAmount) * 100)) : 0
    const isExceeded = maxAmount > 0 && spent > maxAmount

    return {
        ...budget.toObject(),
        spent,
        remaining,
        percentUsed,
        isExceeded
    }
}

const createBudget = async (req, res) => {
    try {
        const userId = req.user._id

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                message: "Request body missing. In Postman: Body → raw → JSON"
            })
        }

        const { maxAmount, createdDate, endDate, exceedDate, budgetStatus } = req.body

        const parsedAmount = Number(maxAmount)

        if (maxAmount === undefined || maxAmount === null || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
            return res.status(400).json({
                message: "maxAmount is required and must be a positive number"
            })
        }

        const savedBudget = await budgetSchema.create({
            userId,
            maxAmount: parsedAmount,
            createdDate: createdDate || new Date(),
            endDate,
            exceedDate,
            budgetStatus: budgetStatus || "active"
        })

        const data = await attachUsage(savedBudget, userId)

        res.status(201).json({
            message: "budget created..",
            data
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
        const budgets = await budgetSchema.find({ userId }).sort({ createdDate: -1 })

        if (req.query.usage === "true") {
            const budgetsWithUsage = await Promise.all(
                budgets.map((budget) => attachUsage(budget, userId))
            )
            return res.status(200).json({
                message: "budgets fetched..",
                data: budgetsWithUsage
            })
        }

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

        const data = req.query.usage === "true"
            ? await attachUsage(budget, userId)
            : budget

        res.status(200).json({
            message: "budget fetched..",
            data
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

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                message: "Request body missing. Send fields to update."
            })
        }

        const { maxAmount, createdDate, endDate, exceedDate, budgetStatus } = req.body
        const updateFields = {}

        if (maxAmount !== undefined) {
            const parsedAmount = Number(maxAmount)
            if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
                return res.status(400).json({
                    message: "maxAmount must be a positive number"
                })
            }
            updateFields.maxAmount = parsedAmount
        }
        if (createdDate !== undefined) updateFields.createdDate = createdDate
        if (endDate !== undefined) updateFields.endDate = endDate
        if (exceedDate !== undefined) updateFields.exceedDate = exceedDate
        if (budgetStatus !== undefined) updateFields.budgetStatus = budgetStatus

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({
                message: "No valid fields to update"
            })
        }

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

        const data = await attachUsage(updatedBudget, userId)

        res.status(200).json({
            message: "budget updated..",
            data
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
    deleteBudget,
    attachUsage,
}
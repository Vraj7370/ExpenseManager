const expenseSchema = require("../models/ExpenseModel")
const { uploadToCloudinary } = require("../utils/CloudinaryUtil")

const createExpense = async (req, res) => {
    try {
        const userId = req.user._id
        const { title, amount, income, expenseDate, paymentMode, expCat, incomeCategory, description } = req.body

        if (!title?.trim()) {
            return res.status(400).json({ message: "Title is required" })
        }

        const isIncome = income != null && income !== "" && amount == null
        const isExpense = amount != null && amount !== "" && income == null

        if (!isIncome && !isExpense) {
            return res.status(400).json({ message: "Provide either amount (expense) or income" })
        }

        if (isExpense && (!amount || Number(amount) <= 0)) {
            return res.status(400).json({ message: "Valid expense amount is required" })
        }

        if (isIncome && (!income || Number(income) <= 0)) {
            return res.status(400).json({ message: "Valid income amount is required" })
        }

        const payload = {
            title: title.trim(),
            description: description?.trim() || "",
            expenseDate: expenseDate || new Date(),
            paymentMode,
            userId,
        }

        if (isExpense) {
            payload.amount = Number(amount)
            payload.expCat = expCat
        } else {
            payload.income = Number(income)
            payload.incomeCategory = incomeCategory
        }

        const savedExpense = await expenseSchema.create(payload)
        res.status(201).json({
            message: "Record created successfully",
            data: savedExpense,
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while creating record",
        })
    }
}

const expenseListFields = [
    "title",
    "description",
    "amount",
    "income",
    "expenseDate",
    "paymentMode",
    "expCat",
    "incomeCategory",
    "expReceipt",
]

const getExpesneByUserId = async (req, res) => {
    try {
        const userId = req.user._id
        const sort = parseInt(req.query.sort, 10) || 1
        const datesort = parseInt(req.query.date, 10) || 1
        const type = req.query.type || "expense"

        let expenses
        if (type === "expense") {
            expenses = await expenseSchema
                .find({ userId, income: { $exists: false } }, expenseListFields)
                .populate("expCat")
                .sort({ amount: sort, expenseDate: datesort })
        } else {
            expenses = await expenseSchema
                .find({ userId, amount: { $exists: false } }, expenseListFields)
                .populate("incomeCategory")
                .sort({ income: sort, expenseDate: datesort })
        }

        res.status(200).json({
            message: "Records fetched",
            data: expenses,
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while fetching records",
        })
    }
}

const updateExpense = async (req, res) => {
    try {
        const userId = req.user._id
        const { id } = req.params
        const existing = await expenseSchema.findOne({ _id: id, userId })

        if (!existing) {
            return res.status(404).json({ message: "Record not found" })
        }

        const isIncomeRecord = existing.income != null && existing.amount == null
        const { title, description, amount, income, expenseDate, paymentMode, expCat, incomeCategory } = req.body

        if (!title?.trim()) {
            return res.status(400).json({ message: "Title is required" })
        }

        const updateData = {
            title: title.trim(),
            description: description?.trim() || "",
            expenseDate: expenseDate || existing.expenseDate,
            paymentMode: paymentMode || existing.paymentMode,
        }

        if (isIncomeRecord) {
            const incomeVal = income != null ? Number(income) : existing.income
            if (!incomeVal || incomeVal <= 0) {
                return res.status(400).json({ message: "Valid income amount is required" })
            }
            updateData.income = incomeVal
            if (incomeCategory) updateData.incomeCategory = incomeCategory
        } else {
            const amountVal = amount != null ? Number(amount) : existing.amount
            if (!amountVal || amountVal <= 0) {
                return res.status(400).json({ message: "Valid expense amount is required" })
            }
            updateData.amount = amountVal
            if (expCat) updateData.expCat = expCat
        }

        const updated = await expenseSchema
            .findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
            .populate(isIncomeRecord ? "incomeCategory" : "expCat")

        res.status(200).json({
            message: "Record updated successfully",
            data: updated,
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while updating record",
        })
    }
}

const deleteExpense = async (req, res) => {
    try {
        const userId = req.user._id
        const id = req.params.id
        const expense = await expenseSchema.findOneAndDelete({ _id: id, userId })
        if (!expense) {
            return res.status(404).json({
                message: "Record not found",
            })
        }
        res.status(200).json({
            message: "Record deleted",
            data: expense,
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while deleting record",
            err: err.message,
        })
    }
}

const searchExp = async (req, res) => {
    try {
        const userId = req.user._id
        const expName = (req.query.expName || "").trim()
        const type = req.query.type || "expense"
        let expAmount = req.query.expAmount || ""

        if (expAmount) {
            expAmount = parseInt(expAmount, 10)
        }

        const query = { userId }

        if (type === "income") {
            query.amount = { $exists: false }
            if (expAmount) query.income = expAmount
        } else {
            query.income = { $exists: false }
            if (expAmount) query.amount = expAmount
        }

        if (expName) {
            query.$or = [
                { title: { $regex: expName, $options: "i" } },
                { description: { $regex: expName, $options: "i" } },
            ]
        }

        const populateField = type === "income" ? "incomeCategory" : "expCat"
        const foundexp = await expenseSchema.find(query).populate(populateField)

        res.json({
            message: "Search successful",
            data: foundexp,
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while searching records",
        })
    }
}

const uploadReceipt = async (req, res) => {
    try {
        const userId = req.user._id
        const expId = req.body.expId
        const file = req.file

        if (!file) {
            return res.status(400).json({ message: "No file uploaded" })
        }

        const record = await expenseSchema.findOne({ _id: expId, userId })
        if (!record) {
            return res.status(404).json({ message: "Record not found" })
        }

        const cloudinaryResponse = await uploadToCloudinary(file.path)

        if (!cloudinaryResponse) {
            return res.status(500).json({ message: "Error uploading to cloudinary" })
        }

        const updateExp = await expenseSchema.findByIdAndUpdate(
            expId,
            { expReceipt: cloudinaryResponse.secure_url },
            { new: true }
        )

        res.status(200).json({
            message: "Receipt uploaded successfully",
            data: updateExp,
        })
    } catch (err) {
        res.status(500).json({ message: "Error uploading receipt" })
    }
}

const getMonthlySummary = async (req, res) => {
    try {
        const userId = req.user._id
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)

        const [expenseRows, incomeRows] = await Promise.all([
            expenseSchema.find({
                userId,
                income: { $exists: false },
                expenseDate: { $gte: startOfMonth, $lte: endOfMonth },
            }),
            expenseSchema.find({
                userId,
                amount: { $exists: false },
                expenseDate: { $gte: startOfMonth, $lte: endOfMonth },
            }),
        ])

        const totalExpense = expenseRows.reduce((sum, row) => sum + (row.amount || 0), 0)
        const totalIncome = incomeRows.reduce((sum, row) => sum + (row.income || 0), 0)

        res.status(200).json({
            message: "Summary fetched",
            data: {
                month: now.getMonth() + 1,
                year: now.getFullYear(),
                totalExpense,
                totalIncome,
                balance: totalIncome - totalExpense,
                expenseCount: expenseRows.length,
                incomeCount: incomeRows.length,
            },
        })
    } catch (err) {
        res.status(500).json({ message: "Error fetching summary" })
    }
}

module.exports = {
    createExpense,
    getExpesneByUserId,
    updateExpense,
    deleteExpense,
    searchExp,
    uploadReceipt,
    getMonthlySummary,
}

const notificationModel = require("../models/NotificationModel")
const budgetSchema = require("../models/BudgetModel")
const expenseSchema = require("../models/ExpenseModel")
const { attachUsage } = require("./BudgetController")

const formatRupee = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`

const createNotification = async(req,res)=>{

    try{
        const savedNotification = await notificationModel.create(req.body)
        res.status(201).json({
            message:"notification created..",
            data:savedNotification
        })
    }catch(err){
        res.status(500).json({
            message:"error while creating notification..",
            err:err.message
        })
    }

}

const getAllNotifications = async(req,res)=>{

    try{
        const notifications = await notificationModel.find()
        res.status(200).json({
            message:"notifications fetched..",
            data:notifications
        })
    }catch(err){
        res.status(500).json({
            message:"error while fetching notifications..",
            err:err.message
        })
    }

}

const getNotificationById = async(req,res)=>{

    try{
        const notification = await notificationModel.findById(req.params.id)
        if(!notification){
            return res.status(404).json({
                message:"notification not found"
            })
        }
        res.status(200).json({
            message:"notification fetched..",
            data:notification
        })
    }catch(err){
        res.status(500).json({
            message:"error while fetching notification..",
            err:err.message
        })
    }

}

const updateNotification = async(req,res)=>{

    try{
        const updatedNotification = await notificationModel.findByIdAndUpdate(req.params.id,req.body,{new:true})
        if(!updatedNotification){
            return res.status(404).json({
                message:"notification not found"
            })
        }
        res.status(200).json({
            message:"notification updated..",
            data:updatedNotification
        })
    }catch(err){
        res.status(500).json({
            message:"error while updating notification..",
            err:err.message
        })
    }

}

const deleteNotification = async(req,res)=>{

    try{
        const deletedNotification = await notificationModel.findByIdAndDelete(req.params.id)
        if(!deletedNotification){
            return res.status(404).json({
                message:"notification not found"
            })
        }
        res.status(200).json({
            message:"notification deleted..",
            data:deletedNotification
        })
    }catch(err){
        res.status(500).json({
            message:"error while deleting notification..",
            err:err.message
        })
    }

}

const getMyAlerts = async (req, res) => {
    try {
        const userId = req.user._id
        const alerts = []
        const now = new Date()

        const budgets = await budgetSchema.find({ userId, budgetStatus: "active" })
        const budgetsWithUsage = await Promise.all(
            budgets.map((budget) => attachUsage(budget, userId))
        )

        for (const budget of budgetsWithUsage) {
            const budgetLabel = formatRupee(budget.maxAmount)

            if (budget.isExceeded) {
                alerts.push({
                    id: `budget-exceeded-${budget._id}`,
                    level: "danger",
                    title: "Budget exceeded",
                    message: `Spent ${formatRupee(budget.spent)} on a ${budgetLabel} budget (${budget.percentUsed}% used).`,
                    actionPath: "/my-budgets",
                })
            } else if (budget.percentUsed >= 80) {
                alerts.push({
                    id: `budget-warning-${budget._id}`,
                    level: "warning",
                    title: "Budget almost full",
                    message: `${budget.percentUsed}% used — ${formatRupee(budget.remaining)} left of ${budgetLabel}.`,
                    actionPath: "/my-budgets",
                })
            }
        }

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

        const totalExpense = expenseRows.reduce((s, r) => s + (r.amount || 0), 0)
        const totalIncome = incomeRows.reduce((s, r) => s + (r.income || 0), 0)
        const balance = totalIncome - totalExpense

        if (totalExpense > 0 && balance < 0) {
            alerts.push({
                id: `negative-balance-${now.getFullYear()}-${now.getMonth() + 1}`,
                level: "warning",
                title: "Spending above income",
                message: `This month: income ${formatRupee(totalIncome)}, expenses ${formatRupee(totalExpense)}.`,
                actionPath: "/my-expenses",
            })
        }

        if (expenseRows.length === 0 && incomeRows.length === 0) {
            alerts.push({
                id: `no-records-${now.getFullYear()}-${now.getMonth() + 1}`,
                level: "info",
                title: "No records this month",
                message: "Add your first expense or income entry to start tracking.",
                actionPath: "/add-expense",
            })
        }

        res.status(200).json({
            message: "Alerts fetched",
            data: alerts,
            count: alerts.length,
        })
    } catch (err) {
        res.status(500).json({
            message: "Error fetching alerts",
            err: err.message,
        })
    }
}

module.exports = {
    createNotification,
    getAllNotifications,
    getNotificationById,
    updateNotification,
    deleteNotification,
    getMyAlerts,
}

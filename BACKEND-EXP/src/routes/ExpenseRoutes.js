const expenseController = require("../controllers/ExpenseController")
const router = require("express").Router()
const authMiddleware =require("../middleware/AuthMiddleware")
router.post("/",authMiddleware,expenseController.createExpense)
router.get("/expbyuseid",authMiddleware,expenseController.getExpesneByUserId)
module.exports = router
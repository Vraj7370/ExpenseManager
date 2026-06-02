const expenseController = require("../controllers/ExpenseController")
const router = require("express").Router()
const authMiddleware =require("../middleware/AuthMiddleware")
const upload = require("../middleware/UploadMiddleware")

router.post("/",authMiddleware,expenseController.createExpense)
router.get("/summary",authMiddleware,expenseController.getMonthlySummary)
router.get("/expbyuserid",authMiddleware,expenseController.getExpesneByUserId)
router.put("/update/:id",authMiddleware,expenseController.updateExpense)
router.delete("/delete/:id",authMiddleware,expenseController.deleteExpense)
router.get("/search",authMiddleware,expenseController.searchExp)
router.put("/uploadreceipt",authMiddleware,upload.single("receipt"),expenseController.uploadReceipt)

module.exports = router
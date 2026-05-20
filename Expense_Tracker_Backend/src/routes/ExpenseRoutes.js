const expenseController = require("../controllers/ExpenseController")
const router = require("express").Router()
const authMiddleware =require("../middleware/AuthMiddleware")
const upload = require("../middleware/UploadMiddleware")

router.post("/",authMiddleware,expenseController.createExpense)
router.get("/expbyuserid",authMiddleware,expenseController.getExpesneByUserId)
router.delete("/delete/:id",authMiddleware,expenseController.deleteExpense)
router.get("/search",authMiddleware,expenseController.searchExp)
router.get("/search1",authMiddleware,expenseController.searchExp)
router.put("/uploadreceipt",authMiddleware,upload.single("receipt"),expenseController.uploadReceipt)

module.exports = router
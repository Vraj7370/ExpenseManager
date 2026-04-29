const router = require("express").Router()
const categoryController = require("../controllers/ExpCatController")
const authMiddleware =require("../middleware/AuthMiddleware")
router.post("/",authMiddleware,categoryController.createExpenseCategory)
router.get("/userCategory",authMiddleware,categoryController.getExpensecategoriesByUserId)
module.exports = router
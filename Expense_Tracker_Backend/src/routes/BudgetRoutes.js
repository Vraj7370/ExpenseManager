const router = require("express").Router()
const budgetController = require("../controllers/BudgetController")
const authMiddleware = require("../middleware/AuthMiddleware")

router.post("/", authMiddleware, budgetController.createBudget)
router.get("/", authMiddleware, budgetController.getBudgetsByUserId)
router.get("/:id", authMiddleware, budgetController.getBudgetById)
router.put("/update/:id", authMiddleware, budgetController.updateBudget)
router.delete("/delete/:id", authMiddleware, budgetController.deleteBudget)

module.exports = router
const router = require("express").Router()
const categoryController = require("../controllers/IncomeCategoryController")
const authMiddleware =require("../middleware/AuthMiddleware")
router.post("/",authMiddleware,categoryController.createIncomeCategory)
router.get("/incomeCategory",authMiddleware,categoryController.getIncomecategoriesByUserId)
router.put("/updateincomecat/:id",authMiddleware,categoryController.updateMyCategory)
router.delete("/deleteincomecat/:id",authMiddleware,categoryController.deleteMyCategory)
module.exports = router
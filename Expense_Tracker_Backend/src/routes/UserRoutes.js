const router = require("express").Router()
const userController = require("../controllers/UserController")
const authMiddleware = require("../middleware/AuthMiddleware")

router.get("/users", userController.getAllUsers)
router.post("/create", userController.createUser)
router.delete("/delete/:id", userController.deleteUser)
router.post("/login", userController.loginUser)
router.get( "/profile",authMiddleware,userController.getProfile)

module.exports = router
const router = require("express").Router()
const notificationController = require("../controllers/NotificationController")
const authMiddleware = require("../middleware/AuthMiddleware")

router.post("/", authMiddleware, notificationController.createNotification)
router.get("/", authMiddleware, notificationController.getAllNotifications)
router.get("/:id", authMiddleware, notificationController.getNotificationById)
router.put("/:id", authMiddleware, notificationController.updateNotification)
router.delete("/:id", authMiddleware, notificationController.deleteNotification)

module.exports = router

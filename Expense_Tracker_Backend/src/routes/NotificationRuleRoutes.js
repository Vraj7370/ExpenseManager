const router = require("express").Router()
const notificationRuleController = require("../controllers/NotificationRuleController")
const authMiddleware = require("../middleware/AuthMiddleware")

router.post("/", authMiddleware, notificationRuleController.createNotificationRule)
router.get("/", authMiddleware, notificationRuleController.getAllNotificationRules)
router.get("/:id", authMiddleware, notificationRuleController.getNotificationRuleById)
router.put("/:id", authMiddleware, notificationRuleController.updateNotificationRule)
router.delete("/:id", authMiddleware, notificationRuleController.deleteNotificationRule)

module.exports = router

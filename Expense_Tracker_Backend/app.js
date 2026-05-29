require("dotenv").config()
const express = require("express")
const app = express()
app.use(express.json())
const cors = require("cors")
app.use(cors())

const userRoutes = require("./src/routes/UserRoutes")
app.use("/user", userRoutes)

const expCategoryRoutes = require("./src/routes/ExpCategoryRoutes")
app.use("/expCat", expCategoryRoutes)

const incomeCategoryRoutes = require("./src/routes/IncomeCategoryRoutes")
app.use("/incomeCat",incomeCategoryRoutes)

const expenseRoutes = require("./src/routes/ExpenseRoutes")
app.use("/exp", expenseRoutes)

const budgetRoutes = require("./src/routes/BudgetRoutes")
app.use("/budget", budgetRoutes)

const notificationRoutes = require("./src/routes/NotificationRoutes")
app.use("/notification", notificationRoutes)

const notificationRuleRoutes = require("./src/routes/NotificationRuleRoutes")
app.use("/notificationRule", notificationRuleRoutes)

//DBCONNECTION:
const DBConnection = require("./src/utils/DBConnection")
DBConnection()

//server creation..
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`)
})
const express = require("express");
const app = express();

app.use(express.json());
const cors = require("cors")
app.use(cors())

const userRoutes = require("./src/routes/userRoutes");
app.use("/user", userRoutes);

const expCategoryRoutes = require("./src/routes/ExpCategoryRoutes")
app.use("/expCat",expCategoryRoutes)

const expenseRoutes = require("./src/routes/ExpenseRoutes")
app.use("/exp",expenseRoutes)

const DBConnection = require("./src/utils/DBConnection");
DBConnection();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
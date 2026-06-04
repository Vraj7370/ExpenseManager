import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Login } from "../common/Login"
import { ExpenseDashboard } from "../user/ExpenseDashboard"
import { AddCategory } from "../user/AddCategory"
import { GetMyCategories } from "../user/GetMyCategories"
import { UserNavbar } from "../user/UserNavbar"
import { AddExpense } from "../user/AddExpense"
import { MyExpenses } from "../user/MyExpenses"
import { Report } from "../user/Report"
import { Report1 } from "../user/Report1"
import { UserProfile } from "../user/UserProfile"
import { Settings } from "../user/Settings"
import { Notifications } from "../user/Notifications"
import { Sigup } from "../common/Sigup"
import { ForgotPassword } from "../common/ForgotPassword"
import { ResetPassword } from "../common/ResetPassword"
import { AuthRequiredRoute, GuestRoute } from "./RouteGuards"
import { AddBudget } from "../user/AddBudget"
import { MyBudgets } from "../user/MyBudgets"
import { NotFound } from "../common/NotFound"


const AppRoutes = () => {

    const router = createBrowserRouter([
        {
            path: "/login",
            element: (
                <GuestRoute>
                    <Login />
                </GuestRoute>
            )
        },
        {
            path: "/signup",
            element: (
                <GuestRoute>
                    <Sigup />
                </GuestRoute>
            )
        },
        {
            path: "/forgot-password",
            element: (
                <GuestRoute>
                    <ForgotPassword />
                </GuestRoute>
            )
        },
        {
            path: "/reset-password",
            element: (
                <GuestRoute>
                    <ResetPassword />
                </GuestRoute>
            )
        },
        {
            path: "/",
            element: <UserNavbar />,
            children: [
                {
                    path: "",
                    element: <ExpenseDashboard />
                },
                {
                    path: "add-category",
                    element: (
                        <AuthRequiredRoute>
                            <AddCategory />
                        </AuthRequiredRoute>
                    )
                },
                {
                    path: "my-categories",
                    element: (
                        <AuthRequiredRoute>
                            <GetMyCategories />
                        </AuthRequiredRoute>
                    )
                },
                {
                    path:"add-expense",
                    element: (
                        <AuthRequiredRoute>
                            <AddExpense />
                        </AuthRequiredRoute>
                    )
                },
                {
                    path:"my-expenses",
                    element: (
                        <AuthRequiredRoute>
                            <MyExpenses />
                        </AuthRequiredRoute>
                    )
                },
                {
                    path:"add-budget",
                    element: (
                        <AuthRequiredRoute>
                            <AddBudget />
                        </AuthRequiredRoute>
                    )
                },
                {
                    path:"my-budgets",
                    element: (
                        <AuthRequiredRoute>
                            <MyBudgets />
                        </AuthRequiredRoute>
                    )
                },
                {
                    path:"reports",
                    element: (
                        <AuthRequiredRoute>
                            <Report />
                        </AuthRequiredRoute>
                    )
                },
                {
                    path:"report1",
                    element: (
                        <AuthRequiredRoute>
                            <Report1 />
                        </AuthRequiredRoute>
                    )
                },
               {
                path:"user-profile",
                element: (
                    <AuthRequiredRoute>
                        <UserProfile/>
                    </AuthRequiredRoute>
                )
               },
               {
                path:"settings",
                element: (
                    <AuthRequiredRoute>
                        <Settings />
                    </AuthRequiredRoute>
                )
               },
               {
                path:"notifications",
                element: (
                    <AuthRequiredRoute>
                        <Notifications />
                    </AuthRequiredRoute>
                )
               },
               {
                path: "*",
                element: <NotFound />
               }
            ]
        },
        {
            path: "*",
            element: <NotFound />
        }
    ])

    return <RouterProvider router={router} />
}

export default AppRoutes;

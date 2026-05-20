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
import { Sigup } from "../common/Sigup"
import { GuestRoute, ProtectedRoute } from "./RouteGuards"


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
            path: "/",
            element: (
                <ProtectedRoute>
                    <UserNavbar />
                </ProtectedRoute>
            ),
            children: [
                {
                    path: "",   // default child route
                    element: <ExpenseDashboard />
                },
                {
                    path: "add-category",
                    element: <AddCategory />
                },
                {
                    path: "my-categories",
                    element: <GetMyCategories />
                },
                {
                    path:"add-expense",
                    element:<AddExpense />
                },
                {
                    path:"my-expenses",
                    element:<MyExpenses />
                },
                {
                    path:"reports",
                    element:<Report />
                },
                {
                    path:"report1",
                    element:<Report1 />
                },
               {
                path:"user-profile",
                element:<UserProfile/>
               },
               {
                path:"settings",
                element:<Settings />
               }
            ]
        }
    ])

    return <RouterProvider router={router} />
}

export default AppRoutes;

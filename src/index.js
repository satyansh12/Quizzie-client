import React from "react";
import ReactDOM from "react-dom/client";
import {createBrowserRouter, RouterProvider, Routes, Route} from "react-router-dom";
import Register from "./screens/register/Register";
import PollCompletion from "./screens/pollCompletion/PollCompletion";
import QuizCompletion from "./screens/quizCompletion/QuizCompletion";
import Questions from "./screens/questions/Questions";
import QuizAnalysis from "./screens/quizAnalysis/QuizAnalysis";
import Root from "./components/root/Root";
import Analytics from "./screens/analytics/Analytics";
import CreateQuiz from "./screens/createQuiz/CreateQuiz";
import Dashboard from "./screens/dashboard/Dashboard";
import PollAnalysis from "./screens/pollAnalysis/PollAnalysis";
import ItemNotFound from "./screens/itemNotFound/ItemNotFound";

const router = createBrowserRouter([
    {
        path: "/register",
        element: <Register/>,
    },
    {
        path: "/",
        element: <Root/>,
        children: [
            {index: true, element: <Dashboard/>}, // Default route under '/'
            {path: "dashboard", element: <Dashboard/>},
            {path: "analytics", element: <Analytics/>},
            {path: "createQuiz", element: <CreateQuiz/>},
            {path: "/quizanalysis/:quizId", element: <QuizAnalysis/>},
            {path: "/pollanalysis/:quizId", element: <PollAnalysis/>},
        ], // Use AuthenticatedRedirect for the root route
    },
    {
        path: "/pollcompleted",
        element: <PollCompletion/>,
    },
    {
        path: "/quizcompleted",
        element: <QuizCompletion/>,
    },
    {
        path: "/quiz/:quizId",
        element: <Questions/>,
    },
    {
        path: "/item-not-found",
        element: <ItemNotFound/>,
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router}>
            <Routes>
                {router}
                {/* Catch-all route for undefined routes */}
                <Route element={<ItemNotFound/>}/>
            </Routes>
        </RouterProvider>
    </React.StrictMode>
);

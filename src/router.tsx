import { createBrowserRouter } from "react-router-dom";
import LandingPage from "@/pages/landing-page";
import Scout from "@/pages/scout";


const router = createBrowserRouter([
    {
        path: '/',
        element: <LandingPage />,
    },
    {
        path: '/app',
        element: <Scout />
    }
])


export default router
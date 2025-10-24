import {createBrowserRouter} from "react-router";
import RootLayout from "./template/RootLayout.tsx";
import Home from "./pages/Home/Home.tsx";
import About from "./pages/About/About.tsx";
import NotFound from "./component/Common/NotFound.tsx";
import LoginForm from "./Test.jsx"

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            {index: true, element: <Home />},
        ]
    },
    {
        path: 'about',
        element: <About />
    },
    {
        path: 'test',
        element: <LoginForm />
    },
    {
        path: '*',
        element: <NotFound />
    }
])

export default router

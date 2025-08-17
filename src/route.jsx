import {createBrowserRouter} from "react-router";
import RootLayout from "./template/RootLayout.jsx";
import Home from "./pages/Home/Home.jsx";
import About from "./pages/About/About.jsx";
import NotFound from "./component/Common/NotFound.jsx";

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
        path: '*',
        element: <NotFound />
    }
])

export default router

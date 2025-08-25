import {Outlet} from "react-router";
import MobileUnsupported from "../component/Common/MobileUnsupported.jsx";

function RootLayout(){
    return (
        <div style={{width: '100vw', height: '100dvh'}}>
            <MobileUnsupported />
            <Outlet />
        </div>
    )
}

export default RootLayout

import {Outlet} from "react-router";
import MobileUnsupported from "../component/Common/MobileUnsupported.jsx";

function RootLayout() {
    return (
        <div
            style={{
                width: '100vw',
                height: '100vh',
                margin: 0,
                padding: 0,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <MobileUnsupported />
            <Outlet />
        </div>
    );
}

export default RootLayout;

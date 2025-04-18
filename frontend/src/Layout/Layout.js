import React from "react";
import TopNav from "../components/TopNav";
import BottomNav from "../components/BottomNav";
import ColorCursor from "../components/ColorCursor";
import "../scss/layouts/layout.scss";
 function Layout({ children }) {
    return (
        <div className="layout">
            <ColorCursor />
                <TopNav />
            {children}
                <BottomNav />
        </div>
    );
}

export default Layout;
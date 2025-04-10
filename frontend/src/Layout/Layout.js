import React from "react";
import TopNav from "../components/TopNav";
import BottomNav from "../components/BottomNav";
import "../scss/layouts/layout.scss";
 function Layout({ children }) {
    return (
        <div className="layout">
            <TopNav />
            {children}
            <BottomNav />
        </div>
    );
}

export default Layout;
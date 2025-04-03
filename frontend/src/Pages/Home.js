import React from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import "../scss/components/Breadcrumbs.scss";
import "../scss/pages/Home.scss";
function Home() {
    return (
        <div className="home">
            <Breadcrumbs />
        </div>
    );
}
export default Home;
import React from "react";
import { Link, useLocation } from "react-router-dom";


function Breadcrumbs() {
    const location = useLocation();
    const pathSegments = location.pathname
        .split("/")
        .filter((segment) => segment)

    return (
        <div className="breadcrumbs">
            <Link to="/">Home</Link>
            {pathSegments.map((segment, index) => {
                const path = `/${pathSegments.slice(0, index + 1).join("/")}`;

                const formattedSegment = decodeURIComponent(segment).replace(/-/g, ' ');

                return (
                    <React.Fragment key={path}>
                        <span className="arrow">&gt;</span>
                        {index === pathSegments.length  ? (
                            <span className="current">{formattedSegment}</span>
                        ) : (
                            <Link to={path}>{formattedSegment}</Link>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

export default Breadcrumbs;

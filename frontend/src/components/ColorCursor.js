import React, { useEffect, useRef } from "react";
import "../scss/components/ColorCursor.scss";

const ColorCursor = () => {
    const cursorRef = useRef(null);

    useEffect(() => {
        const cursor = cursorRef.current;

        const updateCursor = (e) => {
            const { clientX, clientY } = e;
            cursor.style.background = `radial-gradient(
                600px at ${clientX}px ${clientY}px,
                rgba(42, 109, 253, 0.4),
                transparent 60%
            )`;
        };

        window.addEventListener("mousemove", updateCursor);

        return () => {
            window.removeEventListener("mousemove", updateCursor);
        };
    }, []);

    return <div ref={cursorRef} className="color-cursor"></div>;
};

export default ColorCursor;

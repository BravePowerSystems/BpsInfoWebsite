// Accordion.js
import React, { useState } from "react";
import AccordionItem from "./AccordionItem";
import "../scss/components/Accordion.scss";

const Accordion = ({ items }) => {
    const [activeIndices, setActiveIndices] = useState([]);

    const toggleItem = (index) => {
        setActiveIndices(
            (prev) =>
                prev.includes(index)
                    ? prev.filter((i) => i !== index) // Close if open
                    : [...prev, index] // Open if closed
        );
    };

    return (
        <div className="accordion">
            {items.map((item, index) => (
                <AccordionItem
                    key={`accordion-item-${index}`}
                    isOpen={activeIndices.includes(index)}
                    item={item}
                    index={index}
                    onClick={() => toggleItem(index)}
                />
            ))}
        </div>
    );
};

export default Accordion;

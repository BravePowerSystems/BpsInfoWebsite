import React, { useState } from "react";
import "../scss/components/SpecificationsAccordion.scss";

const SpecificationsAccordion = ({ specifications }) => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    // Group specifications by category if they have categories
    const hasCategories = specifications.some(spec => spec.category);
    
    let groupedSpecs = {};
    if (hasCategories) {
        specifications.forEach(spec => {
            const category = spec.category || "General";
            if (!groupedSpecs[category]) {
                groupedSpecs[category] = [];
            }
            groupedSpecs[category].push(spec);
        });
    }

    return (
        <div className="specifications-accordion">
            {hasCategories ? (
                // Render grouped specifications
                Object.entries(groupedSpecs).map(([category, specs], categoryIndex) => (
                    <div 
                        key={categoryIndex}
                        className={`spec-category ${activeIndex === categoryIndex ? 'active' : ''}`}
                    >
                        <div 
                            className="spec-category-header"
                            onClick={() => toggleAccordion(categoryIndex)}
                        >
                            <h3>{category}</h3>
                            <span className={`indicator ${activeIndex === categoryIndex ? 'rotated' : ''}`}>
                                <img src="/arrow_down.svg" alt="" />
                            </span>
                        </div>
                        {activeIndex === categoryIndex && (
                            <div className="spec-category-content">
                                {specs.map((spec, specIndex) => (
                                    <div key={specIndex} className="spec-item">
                                        <span className="spec-name">{spec.name}</span>
                                        <span className="spec-value">{spec.value}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))
            ) : (
                // Render flat list of specifications
                <div className="spec-list">
                    {specifications.map((spec, index) => (
                        <div key={index} className="spec-item">
                            <span className="spec-name">{spec.name}</span>
                            <span className="spec-value">{spec.value}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SpecificationsAccordion;
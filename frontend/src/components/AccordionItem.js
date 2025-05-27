// AccordionItem.js
import React from "react";

const AccordionItem = ({ item, index, isOpen, onClick }) => {
    return (
        <div
            className={`accordion__item ${
                isOpen ? "accordion__item--open" : ""
            }`}
        >
            <button
                className="accordion__header"
                aria-expanded={isOpen}
                onClick={onClick}
            >
                <div className="accordion__header-content">
                    <h3 className="accordion__title">{item.title}</h3>
                </div>
                <span className={`accordion__indicator ${isOpen ? 'accordion__indicator--rotated' : '' }`}>
                   <img src="../../arrow_down.svg" alt="" />
                </span>
            </button>

            <div className="accordion__content">
                {typeof item.content === "string" ? (
                    <div
                        className="accordion__rich-text"
                        dangerouslySetInnerHTML={{ __html: item.content }}
                    />
                ) : (
                    <div className="accordion__custom-structure">
                        {item.content}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccordionItem;

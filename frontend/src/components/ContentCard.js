import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ContentCard = ({ 
    id, 
    title, 
    description, 
    image, 
    link, 
    imageAlt, 
    isReversed = false,
    motionProps = {},
    showDivider = true 
}) => {
    const truncateText = (text, maxLength = 50) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };
    return (
        <>
            <motion.div 
                className={`content-card ${isReversed ? 'content-card--reversed' : ''}`}
                {...motionProps}
            >
                <div className="content-card__content">
                    <h3 className="content-card__title">{title}</h3>
                    {showDivider && <div className="content-card__divider"></div>}
                    <p className="content-card__description">{truncateText(description, 50)}</p>
                    <Link to={link} className="content-card__link">
                        Read more
                    </Link>
                </div>
                <img 
                    src={image} 
                    alt={imageAlt || title} 
                    className="content-card__image"
                />
            </motion.div>
            {showDivider && <div className="content-card__breaker"></div>}
        </>
    );
};

export default ContentCard;

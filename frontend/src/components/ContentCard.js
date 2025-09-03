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
    return (
        <>
            <motion.div 
                className={`content-card ${isReversed ? 'content-card--reversed' : ''}`}
                {...motionProps}
            >
                <div className="content-card__content">
                    <h3 className="content-card__title">{title}</h3>
                    {showDivider && <div className="content-card__divider"></div>}
                    <p className="content-card__description">{description}</p>
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

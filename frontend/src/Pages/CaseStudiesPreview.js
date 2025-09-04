import React, { useState, useEffect } from "react";
import ContentCard from "../components/ContentCard";
import "../scss/components/ContentCard.scss";
import { motion } from "framer-motion";
import { fadeInUpVariants } from "../components/HeroSection";
import { ContentService } from "../services/contentService";
import Loading from "../components/Loading";

const motionConfig = {
    headerContainer: {
        variants: fadeInUpVariants,
        initial: "hidden",
        animate: "visible",
        transition: { duration: 0.8, delay: 0.4 },
    },
    contentList: {
        variants: fadeInUpVariants,
        initial: "hidden",
        animate: "visible",
        transition: { duration: 0.8, delay: 0.6 },
    },
};

function CaseStudiesPreview() {
    const [caseStudiesData, setCaseStudiesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCaseStudies();
    }, []);

    const fetchCaseStudies = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const content = await ContentService.getContentByType('case-study', 'published');
            
            const transformedContent = content.map(item => ({
                id: item._id,
                title: item.title,
                description: item.excerpt,
                image: item.featuredImage || "/pic1.jpeg", 
                link: `/case-studies/${item.slug}`,
                imageAlt: item.title
            }));
            
            setCaseStudiesData(transformedContent);
        } catch (err) {
            console.error('Error fetching case studies:', err);
            setError('Failed to load case studies. Please try again later.');
        } finally {
            setLoading(false);
        }
    };
    if (loading) {
        return <Loading text="Loading case studies..." />;
    }

    if (error) {
        return (
            <div className="content-section">
                <div className="error-message">
                    <h2>Oops! Something went wrong</h2>
                    <p>{error}</p>
                    <button onClick={fetchCaseStudies} className="retry-btn">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="content-section">
            <motion.div 
                className="content-section__header"
                {...motionConfig.headerContainer}
            >
                <h1 className="content-section__title">Case Studies</h1>
                <p className="content-section__subtitle">Explore our successful implementations</p>
                <p className="content-section__description">
                    Discover how our solutions have helped businesses across various industries 
                    overcome challenges and achieve significant improvements in efficiency, 
                    productivity, and cost savings.
                </p>
            </motion.div>

            {caseStudiesData.length === 0 ? (
                <div className="no-content">
                    <h3>No case studies available</h3>
                    <p>Check back later for new case studies!</p>
                </div>
            ) : (
                <motion.div 
                    className="content-section__list"
                    {...motionConfig.contentList}
                >
                    {caseStudiesData.map((caseStudy, index) => (
                        <ContentCard
                            key={caseStudy.id}
                            {...caseStudy}
                            isReversed={index % 2 === 1}
                            motionProps={{
                                variants: fadeInUpVariants,
                                initial: "hidden",
                                whileInView: "visible",
                                viewport: { once: true },
                                transition: { duration: 0.8, delay: index * 0.2 }
                            }}
                        />
                    ))}
                </motion.div>
            )}
        </div>
    );
}

export default CaseStudiesPreview;
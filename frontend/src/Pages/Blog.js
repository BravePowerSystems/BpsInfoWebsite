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

function Blog() {
    const [blogData, setBlogData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBlogContent();
    }, []);

    const fetchBlogContent = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const content = await ContentService.getContentByType('blog', 'published');
            
            const transformedContent = content.map(item => ({
                id: item._id,
                title: item.title,
                description: item.excerpt,
                image: item.featuredImage || "/pic1.jpeg", 
                link: `/blog/${item.slug}`,
                imageAlt: item.title
            }));
            
            setBlogData(transformedContent);
        } catch (err) {
            console.error('Error fetching blog content:', err);
            setError('Failed to load blog content. Please try again later.');
        } finally {
            setLoading(false);
        }
    };
    if (loading) {
        return <Loading text="Loading blog posts..." />;
    }

    if (error) {
        return (
            <div className="content-section">
                <div className="error-message">
                    <h2>Oops! Something went wrong</h2>
                    <p>{error}</p>
                    <button onClick={fetchBlogContent} className="retry-btn">
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
                <h1 className="content-section__title">Blog</h1>
                <p className="content-section__subtitle">Discover all our blog posts</p>
                <p className="content-section__description">
                    Explore insights, case studies, and industry trends in IoT and smart technology. From technical deep-dives to business transformation stories, discover how our solutions are shaping the future.
                </p>
            </motion.div>

            {blogData.length === 0 ? (
                <div className="no-content">
                    <h3>No blog posts available</h3>
                    <p>Check back later for new content!</p>
                </div>
            ) : (
                <motion.div 
                    className="content-section__list"
                    {...motionConfig.contentList}
                >
                    {blogData.map((blog, index) => (
                        <ContentCard
                            key={blog.id}
                            {...blog}
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

export default Blog;
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ContentLayout from "../components/ContentLayout";
import "../scss/components/ContentLayout.scss";
import { ContentService } from "../services/contentService";
import Loading from "../components/Loading";

function BlogPost() {
    const { slug } = useParams();
    const [blogPostData, setBlogPostData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        window.scrollTo(0, 0);
        fetchBlogPost();
    }, [slug]);

    const fetchBlogPost = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const content = await ContentService.getContentBySlug(slug);
            
            if (!content) {
                setError('Blog post not found');
                return;
            }
            
            const transformedData = {
                title: content.title,
                heroImage: content.featuredImage || "/pic1.jpeg",
                sections: content.sections?.map((section, index) => ({
                    id: index + 1,
                    title: section.title.toUpperCase(),
                    description: section.content,
                    images: section.image ? [section.image] : [],
                    theme: index % 2 === 0 ? "light" : "dark"
                })) || [
                    {
                        id: 1,
                        title: "CONTENT",
                        description: content.content,
                        images: [],
                        theme: "light"
                    }
                ]
            };
            
            setBlogPostData(transformedData);
        } catch (err) {
            console.error('Error fetching blog post:', err);
            setError('Failed to load blog post. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading text="Loading blog post..." />;
    }

    if (error) {
        return (
            <div className="content-section">
                <div className="error-message">
                    <h2>Oops! Something went wrong</h2>
                    <p>{error}</p>
                    <button onClick={fetchBlogPost} className="retry-btn">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!blogPostData) {
        return (
            <div className="content-section">
                <div className="no-content">
                    <h2>Blog post not found</h2>
                    <p>The blog post you're looking for doesn't exist or has been removed.</p>
                </div>
            </div>
        );
    }

    return (
        <ContentLayout
            type="blog"
            title={blogPostData.title}
            heroImage={blogPostData.heroImage}
            sections={blogPostData.sections}
            backLink="/blog"
            backLinkText="Back to Blog"
        />
    );
}

export default BlogPost;

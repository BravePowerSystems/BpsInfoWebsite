import React, { useEffect, useState } from "react";
import {  useParams } from "react-router-dom";
import ContentLayout from "../components/ContentLayout";
import "../scss/components/ContentLayout.scss";
import { ContentService } from "../services/contentService";
import Loading from "../components/Loading";

function CaseStudy() {
    const { caseStudySlug } = useParams();
    const [caseStudyData, setCaseStudyData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        window.scrollTo(0, 0);
        fetchCaseStudy();
    }, [caseStudySlug]);

    const fetchCaseStudy = async () => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('Fetching case study with slug:', caseStudySlug);
            const content = await ContentService.getContentBySlug(caseStudySlug);
            console.log('Fetched content:', content);
            
            if (!content) {
                setError('Case study not found');
                return;
            }
            
            // Transform content to match ContentLayout props
            const transformedData = {
                title: content.title,
                client: content.client || "Client Name", // Add client field to content model if needed
                industry: content.industry || "Technology", // Add industry field to content model if needed
                duration: content.duration || "6 months", // Add duration field to content model if needed
                year: content.year || new Date().getFullYear().toString(), // Add year field to content model if needed
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
                        title: "CASE STUDY",
                        description: content.content,
                        images: [],
                        theme: "light"
                    }
                ],
                results: content.results || [
                    "Significant improvement in operational efficiency",
                    "Reduced maintenance costs",
                    "Enhanced system reliability",
                    "Positive return on investment"
                ],
                testimonial: content.testimonial || {
                    quote: "This solution has transformed our operations and provided valuable insights for our business.",
                    author: content.author || "Client Representative",
                    position: "Client Company"
                }
            };
            
            setCaseStudyData(transformedData);
        } catch (err) {
            console.error('Error fetching case study:', err);
            console.error('Error details:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            });
            setError(`Failed to load case study: ${err.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading text="Loading case study..." />;
    }

    if (error) {
        return (
            <div className="content-section">
                <div className="error-message">
                    <h2>Oops! Something went wrong</h2>
                    <p>{error}</p>
                    <button onClick={fetchCaseStudy} className="retry-btn">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!caseStudyData) {
        return (
            <div className="content-section">
                <div className="no-content">
                    <h2>Case study not found</h2>
                    <p>The case study you're looking for doesn't exist or has been removed.</p>
                </div>
            </div>
        );
    }

    return (
        <ContentLayout
            type="case-study"
            title={caseStudyData.title}
            client={caseStudyData.client}
            industry={caseStudyData.industry}
            duration={caseStudyData.duration}
            year={caseStudyData.year}
            heroImage={caseStudyData.heroImage}
            sections={caseStudyData.sections}
            results={caseStudyData.results}
            testimonial={caseStudyData.testimonial}
            backLink="/case-studies"
            backLinkText="Back to Case Studies"
        />
    );
}

export default CaseStudy;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../scss/components/Breadcrumbs.scss";
import "../scss/components/ContentCard.scss";
import "../scss/pages/Home.scss";
import HeroSection from "../components/HeroSection";
import CategoryCarousel from "../components/CategoryCarousel";
import ContactForm from "../components/ContactForm";
import ContentCard from "../components/ContentCard";
import { productService } from "../services/productService";
import { ContentService } from "../services/contentService";


// Company values data
const companyValues = [
    {
        title: "Innovation",
        description: "We constantly push the boundaries of what's possible in power systems."
    },
    {
        title: "Quality",
        description: "We never compromise on the quality of our products and services."
    },
    {
        title: "Reliability",
        description: "Our customers depend on our solutions, and we take that responsibility seriously."
    },
    {
        title: "Sustainability",
        description: "We're committed to developing eco-friendly power solutions for a better future."
    }
];


function Home() {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [featuredCaseStudies, setFeaturedCaseStudies] = useState([]);
    const [caseStudiesLoading, setCaseStudiesLoading] = useState(true);

    // Fetch featured products (transmitters and IOT-and-PLC-Modules)
    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                setLoading(true);
                const [transmittersResponse, iotModulesResponse] = await Promise.all([
                    productService.getProductsByCategory('Transmitters'),
                    productService.getProductsByCategory('IOT-and-PLC-Modules')
                ]);

                // Combine and limit to 4 products for featured section
                const allProducts = [
                    ...transmittersResponse.data,
                    ...iotModulesResponse.data
                ];

                // Transform products to match the expected format for CategoryCarousel
                const transformedProducts = allProducts.slice(0, 4).map(product => ({
                    title: product.title,
                    description: product.description,
                    imageUrl: product.imageUrl,
                    link: product.link
                }));

                setFeaturedProducts(transformedProducts);
            } catch (error) {
                console.error('Error fetching featured products:', error);
                // Fallback to empty array if fetch fails
                setFeaturedProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    // Fetch featured case studies
    useEffect(() => {
        const fetchFeaturedCaseStudies = async () => {
            try {
                setCaseStudiesLoading(true);
                const response = await ContentService.getContentByType('case-study', 'published');
                
                // Transform case studies to match the expected format for ContentCard
                const transformedCaseStudies = response.slice(0, 2).map(caseStudy => ({
                    id: caseStudy._id,
                    title: caseStudy.title,
                    description: caseStudy.excerpt,
                    image: caseStudy.featuredImage || "/pic1.jpeg", // fallback image
                    link: `/case-studies/${caseStudy.slug}`,
                    imageAlt: caseStudy.title
                }));

                setFeaturedCaseStudies(transformedCaseStudies);
            } catch (error) {
                console.error('Error fetching featured case studies:', error);
                // Fallback to empty array if fetch fails
                setFeaturedCaseStudies([]);
            } finally {
                setCaseStudiesLoading(false);
            }
        };

        fetchFeaturedCaseStudies();
    }, []);

    useEffect(() => {
        // Check if there's a hash in the URL (e.g., #contact)
        if (window.location.hash) {
            const element = document.querySelector(window.location.hash);
            if (element) {
                // Add a small delay to ensure the page is fully rendered
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, []);

    return (
        <>
            <div className="home">
                <HeroSection />
                
                {/* Services Overview Section */}
                <section className="services-overview">
                    <div className="container">
                        <h2>Our Solutions</h2>
                        <p className="services-subtitle">
                            Comprehensive IoT solutions for industrial, commercial, and residential applications
                        </p>
                        <div className="services-grid">
                            <div className="service-card">
                                <div className="service-icon">🏭</div>
                                <h3>Industrial IoT</h3>
                                <p>Smart sensors and monitoring systems for manufacturing and industrial processes</p>
                            </div>
                            <div className="service-card">
                                <div className="service-icon">🏢</div>
                                <h3>Smart Buildings</h3>
                                <p>Energy management and environmental monitoring for commercial spaces</p>
                            </div>
                            <div className="service-card">
                                <div className="service-icon">🏠</div>
                                <h3>Connected Homes</h3>
                                <p>IoT solutions for residential automation and monitoring</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Products Section */}
                <section className="featured-products">
                    <div className="container">
                        <h2>Featured Products</h2>
                        <p className="section-subtitle">
                            Discover our latest IoT solutions and transmitters
                        </p>
                        {loading ? (
                            <div className="loading-container">
                                <p>Loading featured products...</p>
                            </div>
                        ) : featuredProducts.length > 0 ? (
                            <CategoryCarousel 
                                categoryName="Featured Products" 
                                products={featuredProducts} 
                            />
                        ) : (
                            <div className="no-products">
                                <p>No featured products available at the moment.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Company Values Section */}
                <section className="company-values">
                    <div className="container">
                        <h2>Why Choose Brave Power Systems</h2>
                        <p className="section-subtitle">
                            Our commitment to excellence drives everything we do
                        </p>
                        <div className="values-grid">
                            {companyValues.map((value, index) => (
                                <div key={index} className="value-card">
                                    <h3>{value.title}</h3>
                                    <p>{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Case Studies Preview Section */}
                <section className="content-section">
                    <div className="container">
                        <h2>Success Stories</h2>
                        <p className="section-subtitle">
                            See how our solutions have transformed businesses
                        </p>
                        {caseStudiesLoading ? (
                            <div className="loading-container">
                                <p>Loading success stories...</p>
                            </div>
                        ) : featuredCaseStudies.length > 0 ? (
                            <div className="content-section__list">
                                {featuredCaseStudies.map((caseStudy, index) => (
                                    <ContentCard
                                        key={caseStudy.id}
                                        {...caseStudy}
                                        isReversed={index % 2 === 1}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="no-content">
                                <p>No success stories available at the moment.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Contact Information Section */}
                <section id="contact" className="contact-info-section">
                    <div className="container">
                        <h2>Ready to Get Started?</h2>
                        <p className="section-subtitle">
                            Let's discuss how our IoT solutions can benefit your business
                        </p>
                        <div className="contact-content">
                            <div className="contact-info">
                                <div className="info-card">
                                    <h3>Office Address</h3>
                                    <p>🏬 Brave Power Systems</p>
                                    <p>📍 Bengaluru, India</p>
                                </div>
                                
                                <div className="info-card">
                                    <h3>Contact Details</h3>
                                    <p>📞 +917942701967</p>
                                    <p>✉️ info@bravepowersystems.com</p>
                                </div>
                            </div>
                            
                            <div className="contact-form-container">
                              
                                <ContactForm />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export default Home;

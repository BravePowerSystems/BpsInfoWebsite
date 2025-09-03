import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../scss/components/Breadcrumbs.scss";
import "../scss/components/ContentCard.scss";
import "../scss/pages/Home.scss";
import HeroSection from "../components/HeroSection";
import CategoryCarousel from "../components/CategoryCarousel";
import ContactForm from "../components/ContactForm";
import ContentCard from "../components/ContentCard";

// Sample featured products data for home page
const featuredProducts = [
    {
        title: "Gas Flow Pulse Transmitter",
        description: "Advanced IoT transmitter for precise gas flow monitoring",
        imageUrl: "/gasFlowPulseTransmitter.png",
        link: "/products/gas-flow-transmitter"
    },
    {
        title: "Water Flow Transmitter",
        description: "Smart water flow monitoring solution",
        imageUrl: "/25-WFT25.jpg",
        link: "/products/water-flow-transmitter"
    },
    {
        title: "Temperature & Humidity Transmitter",
        description: "Environmental monitoring for industrial applications",
        imageUrl: "/31-THT31.jpg",
        link: "/products/temperature-humidity-transmitter"
    },
    {
        title: "CO2 Transmitter",
        description: "Air quality monitoring and control",
        imageUrl: "/34-CO234.jpg",
        link: "/products/co2-transmitter"
    }
];

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

// Featured case studies data
const featuredCaseStudies = [
    {
        id: 1,
        title: "Industrial IoT Implementation for Manufacturing",
        description: "How we helped a manufacturing company reduce downtime by 35% through IoT sensors and predictive maintenance.",
        image: "/pic1.jpeg",
        link: "/case-studies/industrial-iot-implementation",
        imageAlt: "Industrial IoT Implementation"
    },
    {
        id: 2,
        title: "Smart Energy Monitoring System",
        description: "Implementing a comprehensive energy monitoring solution that reduced energy costs by 28% for a commercial building complex.",
        image: "/pic2.jpg",
        link: "/case-studies/smart-energy-monitoring",
        imageAlt: "Smart Energy Monitoring"
    }
];

function Home() {
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
                        <CategoryCarousel 
                            categoryName="Featured Products" 
                            products={featuredProducts} 
                        />
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
                        <div className="content-section__list">
                            {featuredCaseStudies.map((caseStudy, index) => (
                                <ContentCard
                                    key={caseStudy.id}
                                    {...caseStudy}
                                    isReversed={index % 2 === 1}
                                />
                            ))}
                        </div>
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

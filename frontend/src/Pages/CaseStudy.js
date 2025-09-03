import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ContentLayout from "../components/ContentLayout";
import "../scss/components/ContentLayout.scss";

function CaseStudy() {
    const navigate = useNavigate();
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // This would normally fetch the specific case study data based on the slug
    // For now, we'll use placeholder data
    const caseStudyData = {
        title: "Industrial IoT Implementation for Manufacturing",
        client: "TechManufacture Inc.",
        industry: "Manufacturing",
        duration: "6 months",
        year: "2023",
        heroImage: "../pic1.jpeg",
        sections: [
            {
                id: 1,
                title: "INTRODUCTION",
                description: "TechManufacture Inc. was facing significant challenges with equipment downtime and maintenance costs. Their legacy systems provided limited visibility into machine performance, resulting in unexpected failures and production delays. The company operated a 24/7 manufacturing facility with over 50 critical pieces of equipment, including CNC machines, robotic assembly lines, and quality control systems. The lack of real-time monitoring capabilities meant that maintenance teams were often unaware of equipment issues until they caused complete production stoppages, resulting in significant financial losses and customer delivery delays.",
                images: ["../pic2.jpg"],
                theme: "light"
            },
            {
                id: 2,
                title: "PROBLEM",
                description: "The client was experiencing an average of 12 hours of unplanned downtime per month, costing approximately $25,000 per hour in lost production. Maintenance was primarily reactive, and there was no system in place to predict potential failures or optimize maintenance schedules. Additionally, the company faced challenges with energy consumption optimization, quality control consistency, and regulatory compliance reporting. The maintenance team was spending 60% of their time on emergency repairs rather than preventive maintenance, leading to increased equipment wear and reduced overall system reliability.",
                images: ["../pic3.jpeg"],
                theme: "dark"
            },
            {
                id: 3,
                title: "SOLUTION",
                description: "We implemented a comprehensive IoT solution with sensors on critical equipment, connected to a central monitoring platform. The system collected real-time data on temperature, vibration, power consumption, and other key parameters. Our custom analytics engine used machine learning to identify patterns that preceded failures. The solution included wireless sensor networks deployed across all critical equipment, edge computing devices for local data processing, a cloud-based analytics platform for advanced pattern recognition, and a mobile application for maintenance teams to receive real-time alerts.",
                images: ["../pic4.jpg"],
                theme: "light"
            },
            {
                id: 4,
                title: "IMPACT",
                description: "Within three months of implementation, unplanned downtime was reduced by 35%. Maintenance costs decreased by 28%, and overall equipment effectiveness (OEE) improved by 15%. The client was able to transition from reactive to predictive maintenance, optimizing their maintenance schedule and resource allocation. The predictive maintenance capabilities enabled the company to schedule maintenance during planned downtime periods, reducing the impact on production schedules. Energy consumption was reduced by 22% through better equipment optimization and automated shutdown procedures.",
                images: ["../pic1.jpeg"],
                theme: "dark"
            },
            {
                id: 5,
                title: "CONCLUSION",
                description: "The IoT implementation transformed the client's operations, providing data-driven insights that enabled better decision-making. The return on investment was achieved within 9 months, and the system continues to deliver value through ongoing optimization and expanded capabilities. The success of this project has led to additional IoT implementations across other facilities in the company's network, creating a scalable model for digital transformation. The company has also developed new service offerings for their customers based on the insights gained from their IoT implementation.",
                images: ["../pic2.jpg"],
                theme: "light"
            }
        ],
        results: [
            "35% reduction in unplanned downtime",
            "28% decrease in maintenance costs",
            "15% improvement in overall equipment effectiveness",
            "ROI achieved within 9 months"
        ],
        testimonial: {
            quote: "The IoT solution implemented by the team has transformed our maintenance operations. We now have visibility into our equipment health that we never had before, allowing us to prevent issues before they cause downtime.",
            author: "Sarah Johnson",
            position: "Operations Director, TechManufacture Inc."
        }
    };

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

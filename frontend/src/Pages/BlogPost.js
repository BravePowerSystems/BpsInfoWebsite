import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import ContentLayout from "../components/ContentLayout";
import "../scss/components/ContentLayout.scss";

function BlogPost() {
    const { slug } = useParams();
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // This would normally fetch the specific blog post data based on the slug
    // For now, we'll use sample data
    const blogPostData = {
        title: "The Future of Industrial IoT: Smart Manufacturing Solutions",
        heroImage: "../pic1.jpeg",
        sections: [
            {
                id: 1,
                title: "INTRODUCTION",
                description: "The manufacturing industry is undergoing a revolutionary transformation through the integration of Industrial Internet of Things (IIoT) technologies. Smart sensors, connected devices, and advanced analytics are creating unprecedented opportunities for operational efficiency and predictive maintenance. This technological evolution represents a fundamental shift from traditional reactive maintenance approaches to proactive, data-driven decision-making processes that can significantly reduce downtime and operational costs while improving product quality and worker safety.",
                images: ["../pic2.jpg"],
                theme: "light"
            },
            {
                id: 2,
                title: "KEY TECHNOLOGIES",
                description: "Modern IIoT solutions encompass a comprehensive ecosystem including wireless sensors, edge computing devices, cloud platforms, and machine learning algorithms. These technologies work together to provide real-time monitoring, data analysis, and automated decision-making capabilities. Wireless sensor networks collect critical data on temperature, vibration, pressure, and other operational parameters, while edge computing devices process this information locally to reduce latency and bandwidth requirements. Cloud platforms provide scalable storage and advanced analytics capabilities, enabling manufacturers to leverage historical data for predictive modeling and optimization.",
                images: ["../pic3.jpeg"],
                theme: "dark"
            },
            {
                id: 3,
                title: "IMPLEMENTATION BENEFITS",
                description: "Organizations implementing IIoT solutions typically experience 25-40% reduction in unplanned downtime, 20-30% improvement in energy efficiency, and 15-25% increase in overall equipment effectiveness. The data-driven insights enable proactive maintenance and optimized production schedules, leading to significant cost savings and improved operational performance. Beyond these quantitative benefits, IIoT implementation also provides qualitative improvements such as enhanced worker safety through real-time monitoring of hazardous conditions, improved product quality through continuous process monitoring, and better compliance with regulatory requirements through automated data collection and reporting.",
                images: ["../pic4.jpg"],
                theme: "light"
            },
            {
                id: 4,
                title: "FUTURE OUTLOOK",
                description: "As 5G networks become more prevalent and edge computing capabilities advance, we can expect even more sophisticated IIoT applications. The integration of artificial intelligence and digital twins will further enhance predictive capabilities and autonomous operations. Digital twins, which are virtual representations of physical assets and processes, will enable manufacturers to simulate and optimize operations before implementing changes in the real world. Advanced AI algorithms will provide increasingly accurate predictions about equipment failures, maintenance requirements, and production optimization opportunities.",
                images: ["../pic1.jpeg"],
                theme: "dark"
            }
        ]
    };

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

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Content from '../src/models/Content.js';

// Load environment variables
dotenv.config();

// Sample content data
const sampleContent = [
    {
        title: "Welcome to BPS Info Website",
        type: "blog",
        content: "Welcome to our comprehensive information platform. We provide detailed insights into our products, services, and industry expertise.",
        excerpt: "A comprehensive overview of our company and what we offer to our customers.",
        author: "BPS Team",
        status: "published",
        slug: "welcome-to-bps-info-website",
        seoTitle: "Welcome to BPS Info Website - Your Trusted Partner",
        metaDescription: "Discover BPS Info Website - your comprehensive source for industry insights, product information, and expert guidance.",
        publishDate: new Date(),
        sections: [
            { title: "Introduction", content: "We are a leading provider of industrial solutions and expertise.", type: "text" },
            { title: "Main Content", content: "To deliver innovative solutions that drive industrial excellence.", type: "text" },
            { title: "Conclusion", content: "Quality, innovation, and customer satisfaction are our core values.", type: "text" }
        ]
    },
    {
        title: "Understanding Industrial Automation",
        type: "blog",
        content: "Industrial automation has revolutionized the way we manufacture and process goods. This comprehensive guide explores the key concepts, benefits, and implementation strategies for modern industrial automation systems. From basic automation principles to advanced robotics and AI integration, we cover everything you need to know to stay competitive in today's rapidly evolving industrial landscape.",
        excerpt: "A comprehensive guide to industrial automation, covering key concepts, benefits, and implementation strategies.",
        author: "Tech Expert",
        status: "published",
        slug: "understanding-industrial-automation",
        seoTitle: "Industrial Automation Guide - Complete Overview",
        metaDescription: "Learn about industrial automation, its benefits, and implementation strategies for modern manufacturing.",
        publishDate: new Date(),
        sections: [
            { title: "Introduction", content: "Industrial automation represents a fundamental shift in how we approach manufacturing and industrial processes.", type: "text" },
            { title: "Main Content", content: "The core of industrial automation lies in its ability to streamline operations, reduce human error, and increase efficiency.", type: "text" },
            { title: "Conclusion", content: "As we move forward, industrial automation will continue to evolve and become even more integral to modern manufacturing.", type: "text" }
        ]
    },
    {
        title: "Case Study: Smart Factory Implementation",
        type: "case-study",
        content: "This case study examines the successful implementation of smart factory technologies at a leading manufacturing facility. We explore the challenges faced, solutions implemented, and measurable results achieved. The project resulted in a 40% increase in production efficiency and a 25% reduction in operational costs.",
        excerpt: "A detailed case study of successful smart factory implementation with measurable results.",
        author: "Project Manager",
        status: "published",
        slug: "case-study-smart-factory-implementation",
        seoTitle: "Smart Factory Implementation Case Study",
        metaDescription: "Discover how one company achieved 40% efficiency gains through smart factory implementation.",
        publishDate: new Date(),
        sections: [
            { title: "Background", content: "The manufacturing facility was facing challenges with production efficiency and operational costs.", type: "text" },
            { title: "Challenge", content: "Traditional manufacturing processes were not meeting the demands of modern production requirements.", type: "text" },
            { title: "Solution", content: "Implementation of smart factory technologies including IoT sensors and automated systems.", type: "text" },
            { title: "Results", content: "40% increase in production efficiency and 25% reduction in operational costs.", type: "text" },
            { title: "Lessons Learned", content: "Proper planning and stakeholder engagement are crucial for successful implementation.", type: "text" }
        ]
    },

    {
        title: "Industry Trends 2024",
        type: "blog",
        content: "Stay ahead of the curve with our analysis of the top industry trends for 2024. From emerging technologies to shifting market dynamics, we identify the key factors that will shape the industry landscape in the coming year.",
        excerpt: "Analysis of key industry trends and market dynamics for 2024.",
        author: "Industry Analyst",
        status: "draft",
        slug: "industry-trends-2024",
        seoTitle: "Industry Trends 2024 - What to Expect",
        metaDescription: "Discover the key industry trends and market dynamics that will shape 2024.",
        publishDate: null,
        sections: [
            { title: "Introduction", content: "The year 2024 brings significant changes to the industrial landscape.", type: "text" },
            { title: "Main Content", content: "Key trends include AI integration, sustainability focus, and digital transformation.", type: "text" },
            { title: "Conclusion", content: "Companies must adapt to these trends to remain competitive in the evolving market.", type: "text" }
        ]
    }
];

// Connect to MongoDB
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

// Seed content
async function seedContent() {
    try {
        // Clear existing content
        await Content.deleteMany({});
        console.log('Cleared existing content');

        // Insert sample content
        const insertedContent = await Content.insertMany(sampleContent);
        console.log(`Successfully seeded ${insertedContent.length} content items`);

        // Display summary
        console.log('\nContent Summary:');
        insertedContent.forEach(item => {
            console.log(`- ${item.title} (${item.type}, ${item.status})`);
        });

    } catch (error) {
        console.error('Error seeding content:', error);
    } finally {
        // Close connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

// Run the seeding process
if (process.argv.includes('--run')) {
    connectDB().then(() => seedContent());
} else {
    console.log('To run this script, use: node seedContent.js --run');
}

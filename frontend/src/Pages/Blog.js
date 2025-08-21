import React from "react";

import "../scss/pages/Blog.scss"; 
import {motion} from "framer-motion";
import { fadeInUpVariants } from "../components/HeroSection";
const motionConfig = {
    blogTextContainer: {
        variants: fadeInUpVariants,
        initial: "hidden",
        animate: "visible",
        transition: { duration: 0.8, delay: 0.4 },
    },
    blog: {
        variants: fadeInUpVariants,
        initial: "hidden",
        animate: "visible",
        transition: { duration: 0.8, delay: 0.6 },
    },
};
function Blog(props) {
    return <div className="blog-container">

        <motion.div className="blog-text-container"
        {...motionConfig.blogTextContainer} >
            <h1 className="blog-text">Blog</h1>
            <p className="blog-discover">Discover all our blog posts</p>
            <p className="blog-quote">Discover the achievments taht set us apart. From groundbreaking projects to industry accolades, we take pride in our accomplishments.</p>
        </motion.div>

        <motion.div className="blog"
        {...motionConfig.blog}>  
        <div className="blog-card">
            <div className="blog-content">
             <h3 className="blog-title">Lorem ipsum dolor</h3>
             <p className="hr"></p>
             <p className="blog-description">Lorem ipsum dolor sit amet consectetur adipiscing elit.Lorem ipsum dolor sit amet consectetur adipiscing elit.Lorem ipsum dolor sit amet consectetur adipiscing elit.
             Lorem ipsum dolor sit amet consectetur adipiscing elit.</p>  
            <a href=" " className="read-more" > Read more</a>
            </div>
            <img src="../1.png" alt="iot" className="blog-image"/> 
            </div>  
        <div className="blog-breaker"></div>


        <div className="blog-card">
        <img src="../2.png" alt="iot" className="blog-image"/> 
            <div className="blog-content">
             <h3 className="blog-title">Lorem ipsum dolor</h3>
             <p className="hr"></p>
             <p className="blog-description">Lorem ipsum dolor sit amet consectetur adipiscing elit.Lorem ipsum dolor sit amet consectetur adipiscing elit.Lorem ipsum dolor sit amet consectetur adipiscing elit.
             Lorem ipsum dolor sit amet consectetur adipiscing elit.</p> 
            <a href=" " className="read-more" > Read more</a>
            </div>
            </div>  
        <div className="blog-breaker"></div>

        <div className="blog-card">
            <div className="blog-content">
             <h3 className="blog-title">Lorem ipsum dolor</h3>
             <p className="hr"></p>
             <p className="blog-description">Lorem ipsum dolor sit amet consectetur adipiscing elit.Lorem ipsum dolor sit amet consectetur adipiscing elit.Lorem ipsum dolor sit amet consectetur adipiscing elit.
            Lorem ipsum dolor sit amet consectetur adipiscing elit.</p> 
            <a href=" " className="read-more" > Read more</a>
            </div>
            <img src="../3.png" alt="iot" className="blog-image"/> 
            </div>  
        <div className="blog-breaker"></div>
        
        <div className="blog-card">
        <img src="../4.png" alt="iot" className="blog-image"/> 
            <div className="blog-content">
             <h3 className="blog-title">Lorem ipsum dolor</h3>
             <p className="hr"></p>
            <p className="blog-description">Lorem ipsum dolor sit amet consectetur adipiscing elit.Lorem ipsum dolor sit amet consectetur adipiscing elit.Lorem ipsum dolor sit amet consectetur adipiscing elit.
            Lorem ipsum dolor sit amet consectetur adipiscing elit.</p> 
            <a href=" " className="read-more"> Read more</a>
            </div>
            </div>  
        <div className="blog-breaker"></div>

        </motion.div>
    </div>
}   

export default Blog;
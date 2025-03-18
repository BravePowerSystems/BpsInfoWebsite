import React from "react";

import "../scss/pages/Blog.scss"; 

function Blog(props) {
    return <div className="blog-container">

        <div className="blog-text-container" >
            <h1 className="blog-text">Blog</h1>
            <p className="blog-discover">Discover all our blog posts</p>
            <p className="blog-quote">Discover the achievments taht set us apart. From groundbreaking projects to industry accolades, we take pride in our accomplishments.</p>
        </div>

        <div className="blog-featured-breaker"></div>

        <div className="blog">  
        <div className="blog-card">
            <div className="blog-content">
             <h3 className="blog-title">Lorem ipsum dolor</h3>
             <p className="hr"></p>
             <p className="blog-description">Lorem ipsum dolor sit amet consectetur adipiscing elit.Lorem ipsum dolor sit amet consectetur adipiscing elit.Lorem ipsum dolor sit amet consectetur adipiscing elit.
             Lorem ipsum dolor sit amet consectetur adipiscing elit.</p>  
            <a href=" " className="read-more" > Read more</a>
            </div>
            <img src="../images/1.png" alt="iot" className="blog-image"/> 
            </div>  
        <div className="blog-breaker"></div>


        <div className="blog-card">
        <img src="../images/2.png" alt="iot" className="blog-image"/> 
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
            <img src="../images/3.png" alt="iot" className="blog-image"/> 
            </div>  
        <div className="blog-breaker"></div>
        
        <div className="blog-card">
        <img src="../images/4.png" alt="iot" className="blog-image"/> 
            <div className="blog-content">
             <h3 className="blog-title">Lorem ipsum dolor</h3>
             <p className="hr"></p>
            <p className="blog-description">Lorem ipsum dolor sit amet consectetur adipiscing elit.Lorem ipsum dolor sit amet consectetur adipiscing elit.Lorem ipsum dolor sit amet consectetur adipiscing elit.
            Lorem ipsum dolor sit amet consectetur adipiscing elit.</p> 
            <a href=" " className="read-more"> Read more</a>
            </div>
            </div>  
        <div className="blog-breaker"></div>

        </div>
    </div>
}   

export default Blog;
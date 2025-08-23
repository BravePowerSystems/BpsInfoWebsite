
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function BottomNav() {
    return (
        <motion.div
            className="bottom-nav"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
        >
            <div className="upper">
                <div className="about-us">
                    <ul>
                        <span className="about-us-span">ABOUT US</span>
                        <li>
                            <Link to="/about">Our Story</Link>
                        </li>
                        <li>
                            <button 
                    className="nav-link-button"
                    onClick={() => {
                        // Navigate to home page first
                        window.location.href = '/#contact';
                    }}
                >
                    Contact Us
                </button>
                        </li>
                    </ul>
                </div>
                <div className="products">
                    <ul>
                        <span className="products-span">
                            <Link to="/Products">PRODUCTS</Link>
                        </span>
                        <li>
                            <Link to="/Products/Transmitters">
                                Transmitters
                            </Link>
                        </li>
                        <li>
                            <Link to="/Products/Controllers">Controllers</Link>
                        </li>
                        <li>
                            <Link to="/Products/IOT-and-PLC-Modules">
                                IOT and PLC Module
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="useful-links">
                    <ul>
                        <span className="useful-links-span">USEFUL LINKS</span>
                        <li>
                            <Link to="/Blog">Blog</Link>
                        </li>
                        <li>
                            <Link to="/case-studies">Case Studies</Link>
                        </li>
                    </ul>
                </div>
                <div className="contact-us">
                    <span className="contact-us-span">CONTACT US</span>
                    <p className="office">🏬 Brave Power Systems</p>
                    <p className="city">📍Bengaluru</p>
                    <p className="verifier">✅ India MT Verified Supplier</p>
                    <p className="gst">GST: 29BLFPD4482G1Z1</p>
                    <p className="telephone">Call us ☎ +917942701967 </p>
                </div>
            </div>
            <div className="breaker"></div>
            <div className="bottom">
                <p>© 2021 Brave power systems. All rights reserved</p>
                <div className="social-links">
                    <a
                        href="https://www.facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img src="/facebook.png" alt="Facebook" />
                    </a>
                    <a
                        href="https://api.whatsapp.com/send/?phone=917942701967&text=Hi%21+I+have+a+enquiry.+Can+you+help+me%3F&type=phone_number&app_absent=0"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="whatsapp-link"
                        title="Contact us on WhatsApp"
                    >
                        <img src="/whatsapp.png" alt="WhatsApp" />
                    </a>
                    <a
                        href="https://www.youtube.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="youtube-link"
                    >
                        <img src="/youtube.png" alt="youtube" />
                    </a>
                </div>
            </div>
        </motion.div>
    );
}

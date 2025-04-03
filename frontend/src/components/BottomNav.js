/*************  ✨ Codeium Command 🌟  *************/
import React from "react";
import { Link } from "react-router-dom";
export default function BottomNav() {
    return (
        <div className="bottom-nav">
            <div className="upper">
               
                <div className="about-us">
                    <ul>
                        <span className="about-us-span">ABOUT US</span>
                        <li>
                            <Link to="/our-story">Our Story</Link>
                        </li>
                        <li>
                            <Link to="/contact-us">Contact Us</Link>
                        </li>
                    </ul>
                </div>
                <div className="products">
                    <ul>
                        <span className="products-span">
                            <Link to="/products">PRODUCTS</Link>
                        </span>
                        <li>
                            <Link to="/products/Transmitters">
                                Transmitters
                            </Link>
                        </li>
                        <li>
                            <Link to="/Products/Power-Monitors">
                                Power Monitors
                            </Link>
                        </li>
                        <li>
                            <Link to="/Products/Controllers">Controllers</Link>
                        </li>
                        <li>
                            <Link to="/Products/Modules/IOT-and-PLC-Modules">
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
                    <p class="office">🏬 Brave Power Systems</p>
                    <p class="city">📍Bengaluru</p>
                    <p class="verifier">✅ India MT Verified Supplier</p>
                    <p class="gst">GST: 29BLFPD4482G1Z1</p>
                    <p class="telephone">Call us ☎ +917942701967 </p>
                </div>
            </div>
            <div className="breaker"></div>
            <div className="bottom">
                <p>© 2021 Brave power systems. All rights reserved</p>
                <div className="social-links">
                    <Link
                        to="https://www.facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            src="../images/facebook.png"
                            alt="Facebook"
                        />
                    </Link>
                    <Link
                        to="https://www.whatsapp.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="whatsapp-link"
                    >
                        <img
                            src="../images/whatsapp.png"
                            alt="WhatsApp"
                        />
                    </Link>
                    <Link
                        to="https://www.youtube.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="youtube-link"
                    >
                        <img src="../images/youtube.png" alt="youtube" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

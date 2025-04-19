import React from "react";
import { motion } from "motion/react";
import "../scss/pages/CaseStudy.scss";
const fadeInLeftVariants = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
};
const fadeInRightVariants = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
};
const motionConfig = {
    component1: {
        variants: fadeInLeftVariants,
        initial: "hidden",
        animate: "visible",
        transition: { duration: 0.8, delay: 0.4},
    },
    component2: {
        variants: fadeInRightVariants,
        initial: "hidden",
        animate: "visible",
        transition: { duration: 0.8, delay: 0.6 },
    },
};
function CaseStudy() {
    return (
        <div className="container">
            <div className="components">
                <motion.div className="component1"
                {...motionConfig.component1}
                >
                    <div className="left-images">
                    
                        <img src="../images/pic1.jpeg" alt="iot" className="image1"/>  
                        <img src="../images/pic2.jpg" alt="iot" className="image2"/> 
                        <img src="../images/pic3.jpeg" alt="iot" className="image3"/>
                  
                    </div>

                    <div className="content">
                    <div className="serialNumber">
                    <div className="square"></div>
                    <p>NO.</p>
                    <h1>1</h1>
                    </div>

                    <div className="light-theme">
                    <p className="title">INTRODUCTION</p>
                    <p className="description">Lorem ipsum dolor sit amet , consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</p>
                    </div>
                    </div>

                    <div className="right-image" >
                        <img src="../images/pic4.jpg" alt="iot" className="image4"/>
                    </div>

                </motion.div>

                <motion.div className="component2"
                {...motionConfig.component2}
                >

                <div className="content1">
                    <div className="serialNumber1">
                    <div className="square1"></div>
                    <p>NO.</p>
                    <h1>2</h1>
                    </div>

                    <div className="dark-theme">
                    <p className="title1">PROBLEM</p>
                    <p className="description1">Lorem ipsum dolor sit amet , consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</p>
                    </div>
                    </div>


                    <div className="left-images1">
                    
                        <img src="../images/pic1.jpeg" alt="iot" className="image12"/>  
                        <img src="../images/pic2.jpg" alt="iot" className="image22"/> 
                        <img src="../images/pic3.jpeg" alt="iot" className="image32"/>
                  
                    </div>

                </motion.div>

                <motion.div className="component1"
                {...motionConfig.component1}
                >
                    <div className="left-images">
                    
                        <img src="../images/pic1.jpeg" alt="iot" className="image1"/>  
                        <img src="../images/pic2.jpg" alt="iot" className="image2"/> 
                    
                        <img src="../images/pic3.jpeg" alt="iot" className="image3"/>
                  
                    </div>

                    <div className="content">
                    <div className="serialNumber">
                    <div className="square"></div>
                    <p>NO.</p>
                    <h1>3</h1>
                    </div>

                    <div className="light-theme">
                    <p className="title">SOLUTION</p>
                    <p className="description">Lorem ipsum dolor sit amet , consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</p>
                    </div>
                    </div>

                    <div className="right-image" >
                        <img src="../images/pic4.jpg" alt="iot" className="image4"/>
                    </div>

                </motion.div>

                <motion.div className="component2"
                {...motionConfig.component2}
                >

                <div className="content1">
                    <div className="serialNumber1">
                    <div className="square1"></div>
                    <p>NO.</p>
                    <h1>4</h1>
                    </div>

                    <div className="dark-theme">
                    <p className="title1">IMPACT</p>
                    <p className="description1">Lorem ipsum dolor sit amet , consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</p>
                    </div>
                    </div>


                    <div className="left-images1">
                    
                        <img src="../images/pic1.jpeg" alt="iot" className="image12"/>  
                        <img src="../images/pic2.jpg" alt="iot" className="image22"/> 
                        <img src="../images/pic3.jpeg" alt="iot" className="image32"/>
                  
                    </div>

                </motion.div>

            </div>
        </div>
    )

}    

export default CaseStudy;
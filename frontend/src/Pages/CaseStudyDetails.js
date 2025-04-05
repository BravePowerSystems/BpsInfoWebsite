import React from "react";

import "../scss/pages/CaseStudyDetails.scss";

function CaseStudyDetails() {
    return (
        <div className="CaseStudyDetails-container">
                <div className="CaseStudyDetails-components">
                    <div className="CaseStudyDetails-layout1">
                        <img src="../images/pic1.jpeg" alt="iot" className="image1"/>  
                        <img src="../images/pic2.jpg" alt="iot" className="image2"/> 
                    </div>
                    <div className="CaseStudyDetails-layout2">
                        <img src="../images/pic3.jpeg" alt="iot" className="image3"/>
                    </div>

                    <div className="CaseStudyDetails-content">
                    <div className="CaseStudyDetails-serialNumber">
                    <div className="square"></div>
                    <p>NO.</p>
                    <h1>1</h1>
                    </div>

                    <div className="CaseStudyDetails-Introduction">
                    <p className="CaseStudyDetails-title">INTRODUCTION</p>
                    <p className="CaseStudyDetails-description">Lorem ipsum dolor sit amet , consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</p>
                    </div>
                    </div>

                    <div>
                        <img src="../images/pic5.jpg" alt="iot" className="CaseStudyDetails-image5"/>
                    </div>

                </div>


        </div>
    )

}    

export default CaseStudyDetails
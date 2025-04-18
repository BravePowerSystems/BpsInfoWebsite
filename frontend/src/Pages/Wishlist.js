import React from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import "../scss/pages/Wishlist.scss";

function Wishlist() {
    const handleRemoveItem = (e) => {
        const item = e.target.closest(".wishlist-item");
        if (item) {
            item.remove();
        }
    };

    return (
        <div className="Wishlist-container">
            <div className="path">
                <Breadcrumbs />
            </div>
            <header className="wishlist-header">
                <div className="wishlist-overlay">
                    <img src="../images/heart.png" alt="heart" className="heart-icon" />
                    <h1 className="wishlist-title">Wishlist</h1>
                </div>
                <p className="header-subtitle">Here are your all the items you wish for</p>
            </header>
            <div className="wishlist-content">
                <div className="tab-navigation">
                    <button className="tab" >
                        Your wishlist
                    </button>
                    <button className="tab" >
                        Explore more products
                    </button>
                </div>
                <div className="item-headings">
                    <h3 className="heading">Product image</h3>
                    <h3 className="heading">Product details</h3>
                    <h3 className="heading">Remove</h3>
                </div>
                <div className="breaker"></div>
                <div className="wishlist-items">

                    <div className="wishlist-item">
                        <div className="item-image">
                            <img src="../images/gasFlowPulseTransmitter.png" alt="product-image" className="product-image" />
                        </div>
                        <div className="item-details">
                            <h2 className="item-title">Gas flow pulse transmitter</h2>
                            <p className="item-description">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>
                        <img src="../images/trash.svg" className="trash" alt="trash" onClick={handleRemoveItem} />
                    </div>


                    <div className="wishlist-item">
                        <div className="item-image">
                            <img src="../images/gasFlowPulseTransmitter.png" alt="product-image" className="product-image" />
                        </div>
                        <div className="item-details">
                            <h2 className="item-title">Gas flow pulse transmitter</h2>
                            <p className="item-description">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>
                        <img src="../images/trash.svg" className="trash" alt="trash" onClick={handleRemoveItem} />
                    </div>


                </div>
            </div>
            <button className="enquire-btn">Enquire now</button>
        </div>
    );
}

export default Wishlist;
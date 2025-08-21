import  { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import Loading from "../components/Loading";
import { wishlistService } from "../services/wishlistService";
import { productNotifications } from "../utils/notificationHelper";
import { useAuth } from "../context/AuthContext";
import "../scss/pages/Wishlist.scss";

function Wishlist() {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to login if not authenticated
        if (!user) {
            navigate('/login', { 
                state: { from: '/wishlist', message: 'Please log in to view your wishlist' } 
            });
            return;
        }
        
        fetchWishlist();
    }, [user, navigate]);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const response = await wishlistService.getUserWishlist();
            setWishlistItems(response.data);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            setError('Failed to load wishlist items');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveItem = async (wishlistItemId, productName) => {
        try {
            await wishlistService.removeFromWishlist(wishlistItemId);
            productNotifications.removedFromWishlist(productName);
            // Update the state to remove the item
            setWishlistItems(prevItems => 
                prevItems.filter(item => item.wishlistItemId !== wishlistItemId)
            );
        } catch (error) {
            console.error('Error removing item from wishlist:', error);
            productNotifications.wishlistError();
        }
    };

    const handleExploreProducts = () => {
        navigate('/Products');
    };

    if (loading) return <Loading />;
    
    return (
        <div className="Wishlist-container">
            <div className="path">
                <Breadcrumbs />
            </div>
            <header className="wishlist-header">
                <div className="wishlist-overlay">
                    <img src="/heart.png" alt="heart" className="heart-icon" />
                    <h1 className="wishlist-title">Wishlist</h1>
                </div>
                <p className="header-subtitle">Here are all the items you wish for</p>
            </header>
            <div className="wishlist-content">
                <div className="tab-navigation">
                    <button className="tab active">
                        Your wishlist
                    </button>
                    <button className="tab" onClick={handleExploreProducts}>
                        Explore more products
                    </button>
                </div>
                <div className="item-headings">
                    <h3 className="heading">Product image</h3>
                    <h3 className="heading">Product details</h3>
                    <h3 className="heading">Remove</h3>
                </div>
                <div className="breaker"></div>
                
                {error && <div className="error-message">{error}</div>}
                
                {!error && wishlistItems.length === 0 && (
                    <div className="empty-wishlist">
                        <p>Your wishlist is empty</p>
                        <button onClick={handleExploreProducts} className="explore-btn">
                            Explore Products
                        </button>
                    </div>
                )}
                
                <div className="wishlist-items">
                    {wishlistItems.map((item) => (
                        <div className="wishlist-item" key={item.wishlistItemId}>
                            <div className="item-image">
                                <img 
                                    src={item.product && item.product.imageUrl ? item.product.imageUrl : "/gasFlowPulseTransmitter.png"} 
                                    alt={item.product && item.product.title ? item.product.title : "Product image"} 
                                    className="product-image" 
                                />
                            </div>
                            <div className="item-details">
                                {item.product ? (
                                    <Link 
                                        to={`/products/${item.product.category}/${item.product.title.replace(/\s+/g, '-')}`}
                                        className="item-title"
                                    >
                                        {item.product.title}
                                    </Link>
                                ) : (
                                    <span className="item-title">Product unavailable</span>
                                )}
                                <p className="item-description">
                                    {item.product && item.product.description
                                        ? (item.product.description.length > 150 
                                            ? `${item.product.description.substring(0, 150)}...` 
                                            : item.product.description)
                                        : "No description available."}
                                </p>
                            </div>
                            <img 
                                src="/trash.svg" 
                                className="trash" 
                                alt="trash" 
                                onClick={() => handleRemoveItem(item.wishlistItemId, item.product ? item.product.title : "")} 
                            />
                        </div>
                    ))}
                </div>
            </div>
            
            {wishlistItems.length > 0 && (
                <button 
                    className="enquire-btn"
                    onClick={() => navigate('/contact', { state: { fromWishlist: true } })}
                >
                    Enquire about wishlist items
                </button>
            )}
        </div>
    );
}

export default Wishlist;

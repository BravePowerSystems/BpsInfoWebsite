import { Link } from "react-router-dom";
import "../scss/components/ProductsCard.scss";

function ProductsCard({ image, title, description, link }) {
    const MAX_DESCRIPTION_LENGTH = 60;
    
    // Truncate description if it exceeds the limit
    const truncatedDescription = description && description.length > MAX_DESCRIPTION_LENGTH 
        ? description.substring(0, MAX_DESCRIPTION_LENGTH).trim() + '...'
        : description;

    console.log(link);

    return (
        <div className="card">
            <div className="card-body">
                <img src={image} className="card-img-top" alt={title} />
                
                <div className="card-content">
                    <h5 className="card-title">{title}</h5>
                    <p className="card-text">{truncatedDescription}</p>
                    <div className="card-actions">
                        <Link to={link} className="explore-btn">
                            Explore
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default ProductsCard;



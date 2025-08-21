import { Link } from "react-router-dom";
import "../scss/components/ProductsCard.scss";

function ProductsCard({ image, title, description, link }) {

    console.log(link);

    return (
        <div className="card">
            <div className="card-body">
                <img src={image} className="card-img-top" alt={title} />
                <h5 className="card-title">{title}</h5>
                <div className="card-content">
                    <p className="card-text">{description}</p>
                    <Link to={link} className="btn">
                        Explore
                    </Link>
                </div>
            </div>
        </div>
    );
}


export default ProductsCard;



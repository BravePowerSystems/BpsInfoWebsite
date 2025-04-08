import React from "react";
import { Link } from "react-router-dom";
import ProductsData from "../Pages/ProductsData";
import "../scss/components/ProductsDropDown.scss";
import {motion} from "motion/react";
function ProductsDropDown({ onLinkClick }) {

    return (
        <motion.div class="ProductsDropDown"
        initial={{ opacity: 0}
        }
        animate={{ opacity: 1, transition: { duration: 0.5, type:"tween" }}}>

            {ProductsData.map((categoryObj) => {
                const [categoryName, products] = Object.entries(categoryObj)[0];

                return (
                    <ul>
                        <Link
                            to={`/Products/${categoryName}`}
                            onClick={onLinkClick}
                        >
                            {categoryName.replace(
                                /[^a-zA-Z0-9]/g,
                                " "
                            )}
                        </Link>
                        {products.map((product) => (
                            <li key={product.name}>
                                <Link
                                    to={product.link}
                                    onClick={onLinkClick}
                                >
                                    {product.title.replace(
                                        /[^a-zA-Z0-9]/g,
                                        " "
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                );
            })}
        </motion.div>
    );
}

export default ProductsDropDown;

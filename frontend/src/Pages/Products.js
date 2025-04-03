import React from "react";
import { Link } from "react-router-dom";
import "../scss/pages/Products.scss";
import ProductsCard from "../components/ProductsCard";
import useEmblaCarousel from "embla-carousel-react";
import {
    usePrevNextButtons,
} from "../components/EmblaCarouselArrowButtons";
import ProductsData from "./ProductsData";

function Products() {
    return (
        <div className="products-container">
            <div className="path">
                <Link to="/">Home</Link>
                <p className="arrow">&gt;</p>
                <Link to="/products">Products</Link>
            </div>

            <h1>Products</h1>

            {ProductsData.map((item, index) => (
                <CategoryCarousel
                    key={item.category || index}
                    categoryData={item}
                />
            ))}
        </div>
    );
}

function CategoryCarousel({ categoryData }) {
    const [emblaRef, emblaApi] = useEmblaCarousel();
    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick,
    } = usePrevNextButtons(emblaApi);

    return (
        <div className="category">
            <h3>{categoryData.category}</h3>

            <div className="embla">
                <button
                    className="embla__button embla__button--prev"
                    onClick={onPrevButtonClick}
                    disabled={prevBtnDisabled}
                >
                    &lt;
                </button>
                <div className="embla__viewport" ref={emblaRef}>
                    <div className="embla__container">
                        {categoryData.products.map((product, idx) => (
                            <div
                                className="embla__slide"
                                key={product.title || idx}
                            >
                                <ProductsCard
                                    image="../images/gasFlowPulseTransmitter.png"
                                    title={product.title}
                                    description={product.description}
                                    link={product.link}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <button
                    className="embla__button embla__button--next"
                    onClick={onNextButtonClick}
                    disabled={nextBtnDisabled}
                >
                    &gt;
                </button>
            </div>
        </div>
    );
}

export default Products;

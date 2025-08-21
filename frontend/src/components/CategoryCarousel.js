import React from "react";
import ProductsCard from "./ProductsCard";

import useEmblaCarousel from "embla-carousel-react";
import { usePrevNextButtons } from "./EmblaCarouselArrowButtons";
function CategoryCarousel({ categoryName, products }) {
    const [emblaRef, emblaApi] = useEmblaCarousel();
    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick,
    } = usePrevNextButtons(emblaApi);

    return (
        <>
            <div className="category">
                <h2>{categoryName.replace(/[^a-zA-Z0-9]/g, " ")}</h2>

                <div className="embla">
                    <button
                        className="embla__button embla__button--prev"
                        onClick={onPrevButtonClick}
                        disabled={prevBtnDisabled}
                    >
                        <img
                            src="/arrow_left.svg"
                            alt="prev"
                        />
                    </button>

                    <div className="embla__viewport" ref={emblaRef}>
                        <div className="embla__container">
                            {products.map((product, idx) => (
                                <div
                                    className="embla__slide"
                                    key={product.title || idx}
                                >
                                    <ProductsCard
                                        image={product.imageUrl || "/placeholder-product.png"}
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
                        <img
                            src="/arrow_right.svg"
                            alt="next"
                        />
                    </button>
                </div>
            </div>

            <div className="divider"></div>
        </>
    );
}

export default CategoryCarousel;
import React, { useEffect, useRef } from "react";
import TopNav from "../components/TopNav";
import BottomNav from "../components/BottomNav";
import ColorCursor from "../components/ColorCursor";
import ProductModal from "../components/ProductModal";
import { useLocation } from "react-router-dom";
import { ModalProvider, useModal } from "../context/ModalContext";
import "../scss/layouts/layout.scss";

const LayoutContent = ({ children }) => {
    const layoutRef = useRef(null);
    const location = useLocation();
    const { productModal, closeProductModal } = useModal();

    useEffect(() => {
        if (layoutRef.current) {
            layoutRef.current.scrollTo({
                top: 0,
                left: 0,
            });
        }
    }, [location.pathname]);

    return (
        <div className="layout" ref={layoutRef}>
            <ColorCursor />
            <TopNav />
            {children}
            <BottomNav />
            {productModal.isOpen && (
                <ProductModal 
                    productName={productModal.productName}
                    onClose={closeProductModal}
                />
            )}
        </div>
    );
};

function Layout({ children }) {
    return (
        <ModalProvider>
            <LayoutContent>{children}</LayoutContent>
        </ModalProvider>
    );
}

export default Layout;

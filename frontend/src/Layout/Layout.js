import TopNav from "../components/TopNav";
import BottomNav from "../components/BottomNav";
import ColorCursor from "../components/ColorCursor";
import ProductModal from "../components/ProductModal";
import { ModalProvider, useModal } from "../context/ModalContext";
import { ProductsProvider } from "../context/ProductsContext";
import "../scss/layouts/layout.scss";

const LayoutContent = ({ children }) => {
    const { productModal, closeProductModal } = useModal();


    return (
        <div 
            className="layout" 
        >
            <ColorCursor />
            <TopNav />
            <div className="main-content">
                {children}
            </div>
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
        <ProductsProvider>
            <ModalProvider>
                <LayoutContent>{children}</LayoutContent>
            </ModalProvider>
        </ProductsProvider>
    );
}

export default Layout;

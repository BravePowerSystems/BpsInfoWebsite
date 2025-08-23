import TopNav from "../components/TopNav";
import BottomNav from "../components/BottomNav";
import ColorCursor from "../components/ColorCursor";
import ProductModal from "../components/ProductModal";
import ConfirmationModal from "../components/ConfirmationModal";
import { ModalProvider, useModal } from "../context/ModalContext";
import { ProductsProvider } from "../context/ProductsContext";
import "../scss/layouts/layout.scss";

const LayoutContent = ({ children }) => {
    const { productModal, closeProductModal, confirmationModal, closeConfirmationModal } = useModal();


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
            {confirmationModal.isOpen && (
                <ConfirmationModal
                    isOpen={confirmationModal.isOpen}
                    title={confirmationModal.title}
                    message={confirmationModal.message}
                    onConfirm={confirmationModal.onConfirm}
                    onCancel={confirmationModal.onCancel}
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

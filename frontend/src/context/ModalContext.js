import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
    const [productModal, setProductModal] = useState({
        isOpen: false,
        productName: null
    });

    const openProductModal = (productName) => {
        setProductModal({ isOpen: true, productName });
    };

    const closeProductModal = () => {
        setProductModal({ isOpen: false, productName: null });
    };

    return (
        <ModalContext.Provider value={{ productModal, openProductModal, closeProductModal }}>
            {children}
        </ModalContext.Provider>
    );
};
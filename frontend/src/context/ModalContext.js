import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
    const [productModal, setProductModal] = useState({
        isOpen: false,
        productName: null
    });

    const [confirmationModal, setConfirmationModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null,
        onCancel: null
    });

    const openProductModal = (productName) => {
        setProductModal({ isOpen: true, productName });
    };

    const closeProductModal = () => {
        setProductModal({ isOpen: false, productName: null });
    };

    const openConfirmationModal = (title, message, onConfirm, onCancel) => {
        setConfirmationModal({
            isOpen: true,
            title,
            message,
            onConfirm,
            onCancel
        });
    };

    const closeConfirmationModal = () => {
        setConfirmationModal({
            isOpen: false,
            title: '',
            message: '',
            onConfirm: null,
            onCancel: null
        });
    };

    return (
        <ModalContext.Provider value={{ 
            productModal, 
            openProductModal, 
            closeProductModal,
            confirmationModal,
            openConfirmationModal,
            closeConfirmationModal
        }}>
            {children}
        </ModalContext.Provider>
    );
};
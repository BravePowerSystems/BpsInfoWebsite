import React from 'react';
import '../scss/components/ConfirmationModal.scss';

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
    };

    return (
        <div className="confirmation-modal-overlay">
            <div className="confirmation-modal">
                <div className="confirmation-modal__header">
                    <h3 className="confirmation-modal__title">{title}</h3>
                </div>
                <div className="confirmation-modal__body">
                    <p className="confirmation-modal__message">{message}</p>
                </div>
                <div className="confirmation-modal__footer">
                    <button 
                        className="confirmation-modal__btn confirmation-modal__btn--cancel"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                    <button 
                        className="confirmation-modal__btn confirmation-modal__btn--confirm"
                        onClick={handleConfirm}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;

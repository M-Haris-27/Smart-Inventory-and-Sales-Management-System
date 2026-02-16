import React from 'react';
import Modal from './Modal';

const AlertDialog = ({ isOpen, onClose, title, message, type = 'info' }) => {
    const typeStyles = {
        info: 'text-blue-600',
        success: 'text-green-600',
        error: 'text-red-600',
        warning: 'text-yellow-600'
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            actions={
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    OK
                </button>
            }
        >
            <p className={`${typeStyles[type]}`}>{message}</p>
        </Modal>
    );
};

export default AlertDialog;

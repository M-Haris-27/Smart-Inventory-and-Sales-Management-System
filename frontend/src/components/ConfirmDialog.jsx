import React from 'react';
import Modal from './Modal';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', confirmColor = 'blue' }) => {
    const colorClasses = {
        blue: 'bg-blue-600 hover:bg-blue-700',
        red: 'bg-red-600 hover:bg-red-700',
        green: 'bg-green-600 hover:bg-green-700'
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            actions={
                <>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`px-4 py-2 text-white rounded ${colorClasses[confirmColor]}`}
                    >
                        {confirmText}
                    </button>
                </>
            }
        >
            <p className="text-gray-700">{message}</p>
        </Modal>
    );
};

export default ConfirmDialog;

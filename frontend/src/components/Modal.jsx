import React from 'react';

const Modal = ({ isOpen, onClose, title, children, actions }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="p-6">
                    {title && (
                        <h3 className="text-xl font-bold mb-4">{title}</h3>
                    )}
                    <div className="mb-6">
                        {children}
                    </div>
                    <div className="flex justify-end gap-3">
                        {actions}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;

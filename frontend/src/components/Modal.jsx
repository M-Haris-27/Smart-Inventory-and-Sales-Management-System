import React from 'react';

const Modal = ({ isOpen, onClose, title, children, actions }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-gray-100 animate-slide-up">
                <div className="p-8">
                    {title && (
                        <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{title}</h3>
                    )}
                    <div className="mb-8">
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

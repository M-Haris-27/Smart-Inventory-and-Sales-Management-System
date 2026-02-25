import React from 'react';
import Modal from './Modal';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', confirmColor = 'blue' }) => {
    const colorClasses = {
        blue: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
        red: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800',
        green: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
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
                        className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 font-semibold text-gray-700 transition-all"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`px-6 py-3 text-white rounded-xl font-semibold transition-all shadow-lg ${colorClasses[confirmColor]}`}
                    >
                        {confirmText}
                    </button>
                </>
            }
        >
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <p className="text-gray-700 font-medium leading-relaxed">{message}</p>
            </div>
        </Modal>
    );
};

export default ConfirmDialog;

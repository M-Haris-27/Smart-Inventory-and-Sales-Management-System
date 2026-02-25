import React, { useState, useEffect } from 'react';
import Modal from './Modal';

const InputDialog = ({ isOpen, onClose, onConfirm, title, message, placeholder = '', inputType = 'text', defaultValue = '' }) => {
    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
        if (isOpen) {
            setValue(defaultValue);
        }
    }, [isOpen, defaultValue]);

    const handleSubmit = () => {
        onConfirm(value);
        onClose();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
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
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                    >
                        Confirm
                    </button>
                </>
            }
        >
            <div>
                {message && (
                    <div className="mb-5 p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <p className="text-gray-700 font-medium leading-relaxed">{message}</p>
                    </div>
                )}
                <input
                    type={inputType}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
                    autoFocus
                />
            </div>
        </Modal>
    );
};

export default InputDialog;
